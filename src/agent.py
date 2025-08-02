import logging

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

from llama_index.core import (
    SimpleDirectoryReader,
    StorageContext,
    VectorStoreIndex,
    load_index_from_storage,
)
from pathlib import Path


from prompts import AGENT_INSTRUCTIONS, SESSION_INSTRUCTIONS
from livekit.agents.llm import function_tool


logger = logging.getLogger("agent")

load_dotenv(".env.local")

# check if storage already exists
THIS_DIR = Path(__file__).parent
PERSIST_DIR = THIS_DIR / "query-engine-storage"
if not PERSIST_DIR.exists():
    # load the documents and create the index
    documents = SimpleDirectoryReader(THIS_DIR / "data").load_data()
    index = VectorStoreIndex.from_documents(documents)
    # store it for later
    index.storage_context.persist(persist_dir=PERSIST_DIR)
else:
    # load the existing index
    storage_context = StorageContext.from_defaults(persist_dir=PERSIST_DIR)
    index = load_index_from_storage(storage_context)

#

from utils import get_doc_tools
from pathlib import Path
from llama_index.llms.openai import OpenAI
from llama_index.core.agent.workflow import FunctionAgent

# Step 1: Load tools from files
file_to_tools_dict = {}
for file in Path("src/data").iterdir():
    logger.warning(f"Getting tools for file: {file}")
    vector_tool, summary_tool = get_doc_tools(file, Path(file).stem)
    file_to_tools_dict[file] = [vector_tool, summary_tool]

initial_tools = [
    t for file in Path("src/data").iterdir() for t in file_to_tools_dict[file]
]

logger.warning(f"Number of tools: {len(initial_tools)}")

# Step 2: Initialize LLM
llm = OpenAI(model="gpt-4o-mini")


# Step 3: Create Workflow
workflow = FunctionAgent(
    tools=initial_tools,
    llm=llm,
    system_prompt="You are an agent that can perform basic mathematical operations using tools.",
)

from test import setup_combined_agent

workflow_agent, index, file_tools = setup_combined_agent()


class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(instructions=AGENT_INSTRUCTIONS)

    # all functions annotated with @function_tool will be passed to the LLM when this
    # agent is active
    @function_tool
    async def LiveKit_local_tool(self, context: RunContext, query: str):
        """
        Use this tool to get the data from RAG model

        Args:
            query: The query to get the data for
        """

        try:
            print("\n--- Testing Workflow Agent ---")
            response = await workflow.run(query)
            return str(response)

        except Exception as e:
            print(f"Error during workflow execution in LlamaIndex RAG tool")

    @function_tool
    async def Llamaindex_RAG_tool(self, context: RunContext, query: str):
        try:
            response = await workflow_agent.run(query)
            print(f"Workflow Response: {response}")

        except Exception as e:
            print(f"Error during workflow execution: {e}")


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
        # Speech-to-text (STT) is your agent's ears, turning the user's speech into text that the LLM can understand
        # See all providers at https://docs.livekit.io/agents/integrations/stt/
        stt=deepgram.STT(model="nova-3", language="multi"),
        # Text-to-speech (TTS) is your agent's voice, turning the LLM's text into speech that the user can hear
        # See all providers at https://docs.livekit.io/agents/integrations/tts/
        tts=cartesia.TTS(voice="6f84f4b8-58a2-430c-8c79-688dad597532"),
        turn_detection=EnglishModel(),
        vad=ctx.proc.userdata["vad"],
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
