import logging

from anyio import Path
from dotenv import load_dotenv
from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    JobProcess,
    RoomInputOptions,
    RunContext,
    WorkerOptions,
    cli,
    metrics,
)
from livekit.agents.voice import MetricsCollectedEvent
from livekit.plugins import cartesia, deepgram, noise_cancellation, openai, silero
from livekit.plugins.turn_detector.english import EnglishModel
from livekit.agents import (
    AutoSubscribe,
)


from prompts import AGENT_INSTRUCTIONS, SESSION_INSTRUCTIONS
from livekit.agents.llm import function_tool


logger = logging.getLogger("agent")

load_dotenv(".env.local")

# Imports for RAG with LlamaIndex
from llamaindex_rag import setup_combined_agent

workflow_agent, index, file_tools = setup_combined_agent()

# Imports for RAG with Livekit
from livekit_rag import livekit_rag



class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(instructions=AGENT_INSTRUCTIONS)

    # all functions annotated with @function_tool will be passed to the LLM when this
    # agent is active

    @function_tool
    async def LiveKit_RAG_tool(self, context: RunContext, query: str):
        """
        Use this tool to get the data quickly from Livekit RAG model

        Args:
            query: The query to get the data for
        """

        try:
            response = await livekit_rag(query)
            logger.info(f"Livekit RAG Response: {response}")
            return str(response)

        except Exception as e:
            logger.error(f"Error during workflow execution in LlamaIndex RAG tool")

    @function_tool
    async def Llamaindex_RAG_tool(self, context: RunContext, query: str):
        """
        Only use this tool when deep reasoning is needed.

        Args:
            query: The query to get the data for
        """

        try:
            response = await workflow_agent.run(query)
            logger.info(f"Workflow Response: {response}")
            return str(response)

        except Exception as e:
            logger.error(f"Error during workflow execution: {e}")


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):
    # Logging setup
    # Add any other context you want in all log entries here
    ctx.log_context_fields = {
        "room": ctx.room.name,
    }

    # Create session with the LLM, STT, TTS, turn detection, and VAD
    session = AgentSession(
        llm=openai.LLM(model="gpt-4o-mini"),
        stt=deepgram.STT(model="nova-3", language="multi"),
        tts=cartesia.TTS(voice="6f84f4b8-58a2-430c-8c79-688dad597532"),
        turn_detection=EnglishModel(),
        vad=ctx.proc.userdata["vad"],
        min_interruption_words=2,
    )

    # Log metrics as they are emitted, and total usage after session is over
    usage_collector = metrics.UsageCollector()

    @session.on("metrics_collected")
    def _on_metrics_collected(ev: MetricsCollectedEvent):
        metrics.log_metrics(ev.metrics)
        usage_collector.collect(ev.metrics)

    async def log_usage():
        summary = usage_collector.get_summary()
        logger.info(f"Usage: {summary}")

    # Shutdown callbacks are triggered when the session is over    # shutdown callbacks are triggered when the session is over
    ctx.add_shutdown_callback(log_usage)

    # Start the session
    await session.start(
        agent=Assistant(),
        room=ctx.room,
        room_input_options=RoomInputOptions(
            # LiveKit Cloud enhanced noise cancellation
            # - If self-hosting, omit this parameter
            noise_cancellation=noise_cancellation.BVC(),
            video_enabled=True,
        ),
    )

    # 1. join the room when agent is ready
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    # 2. greet the user
    await session.say(SESSION_INSTRUCTIONS, allow_interruptions=True)


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
