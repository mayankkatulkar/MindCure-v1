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
    AutoSubscribe,
)
from livekit.agents.voice import MetricsCollectedEvent
from livekit.plugins import google, noise_cancellation
from google.genai import types


from prompts import AGENT_INSTRUCTIONS, SESSION_INSTRUCTIONS
from livekit.agents.llm import function_tool


logger = logging.getLogger("agent")

load_dotenv(".env.local")

# Imports for RAG with Livekit
from livekit_rag import livekit_rag

# Imports for RAG with LlamaIndex
from llamaindex_rag import setup_combined_agent

# Import for AutoGen Operator
from autogen_operator import run_operator_task, search_therapists_near, book_therapy_appointment, get_crisis_help

workflow_agent, index, file_tools = setup_combined_agent()


class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(instructions=AGENT_INSTRUCTIONS)

    # all functions annotated with @function_tool will be passed to the LLM when this
    # agent is active

    @function_tool
    async def LiveKit_RAG_tool(self, context: RunContext, query: str):
        """
        Access the comprehensive CBT manual and mental health knowledge base. This contains:
        - A Therapist's Guide to Brief Cognitive Behavioral Therapy
        - Specific CBT techniques and interventions
        - Patient handouts and exercises  
        - Treatment planning approaches
        - Evidence-based strategies for anxiety, depression, etc.
        
        Use this when you need to:
        - Get specific CBT techniques for a user's issue
        - Find exercises or homework assignments
        - Access patient handouts or structured interventions
        - Look up evidence-based approaches for specific disorders

        Args:
            query: Your specific question about CBT techniques, interventions, or mental health approaches
        """

        try:
            response = await livekit_rag(query)
            logger.info(f"Livekit RAG Response: {response}")
            return str(response)

        except Exception as e:
            logger.error(f"Error during workflow execution in LlamaIndex RAG tool: {e}")
            return "I encountered an error while searching the knowledge base."

    @function_tool
    async def Llamaindex_RAG_tool(self, context: RunContext, query: str):
        """
        Advanced reasoning tool for complex therapeutic questions that require deep analysis.
        Use this when you need sophisticated reasoning about:
        - Complex case conceptualization
        - Multi-step treatment planning  
        - Integrating multiple CBT techniques
        - Advanced therapeutic decision-making
        
        Only use this tool when the LiveKit RAG tool isn't sufficient for complex reasoning.

        Args:
            query: Complex therapeutic question requiring deep reasoning and analysis
        """

        try:
            response = await workflow_agent.run(query)
            logger.info(f"Workflow Response: {response}")
            return str(response)

        except Exception as e:
            logger.error(f"Error during workflow execution: {e}")
            return "I encountered an error while processing your complex query."

    @function_tool
    async def autogen_operator_tool(self, context: RunContext, task: str):
        """
        Use this tool for complex automation tasks that require web browsing and interaction.
        This can help with booking appointments, searching for services, filling out forms, etc.
        
        Examples:
        - "Book a therapy appointment at Psychology Today for someone in Atlanta"
        - "Search for mental health crisis centers in Los Angeles"
        - "Find and compare therapist profiles in Boston"
        - "Look up insurance coverage for therapy in Miami"
        
        Args:
            task: Detailed description of the automation task to perform
        """
        try:
            logger.info(f"Running AutoGen operator for task: {task}")
            response = await run_operator_task(task)
            return str(response)
        except Exception as e:
            logger.error(f"AutoGen operator failed: {e}")
            return "I encountered an issue with the automation. Let me help you with the information I have available instead."

    @function_tool
    async def web_automation_tool(self, context: RunContext, task: str):
        """
        Use this tool to perform web automation tasks like searching for therapists, 
        booking appointments, or finding mental health resources online.
        
        Examples:
        - "Search for therapists in San Francisco who specialize in anxiety"
        - "Find crisis mental health resources in New York"
        - "Look up information about depression treatment centers"
        
        Args:
            task: Describe what you want to automate or search for online
        """
        try:
            logger.info(f"Executing web automation task: {task}")
            response = await run_operator_task(task)
            return str(response)
        except Exception as e:
            logger.error(f"Web automation failed: {e}")
            return "I encountered an error while trying to help with that web search. Please try asking me for general information instead."

    @function_tool
    async def find_therapists_tool(self, context: RunContext, location: str, specialty: str = "anxiety"):
        """
        Search for mental health therapists in a specific location and specialty.
        
        Args:
            location: The city or area to search in (e.g., "San Francisco", "New York")
            specialty: The type of therapy specialization (e.g., "anxiety", "depression", "trauma", "couples")
        """
        try:
            logger.info(f"Searching for {specialty} therapists in {location}")
            response = await search_therapists_near(location, specialty)
            return str(response)
        except Exception as e:
            logger.error(f"Therapist search failed: {e}")
            return f"I'm having trouble searching for therapists right now. I'd recommend checking Psychology Today or your insurance provider's website for therapists in {location}."

    @function_tool
    async def emergency_resources_tool(self, context: RunContext, location: str):
        """
        Find immediate mental health crisis resources and emergency services.
        Use this when someone needs urgent help or is in crisis.
        
        Args:
            location: The city or area to find crisis resources for
        """
        try:
            logger.info(f"Finding crisis resources in {location}")
            response = await get_crisis_help(location)
            return str(response)
        except Exception as e:
            logger.error(f"Crisis resource search failed: {e}")
            return f"""I'm having trouble finding specific crisis resources right now. Please remember these important numbers:
            
            🚨 EMERGENCY SERVICES:
            - National Suicide Prevention Lifeline: 988
            - Crisis Text Line: Text HOME to 741741
            - Emergency Services: 911
            
            If you're in immediate danger, please call 911 or go to your nearest emergency room."""


def prewarm(proc: JobProcess):
    # No need for VAD prewarming with Gemini Live API
    pass


async def entrypoint(ctx: JobContext):
    # Logging setup
    # Add any other context you want in all log entries here
    ctx.log_context_fields = {
        "room": ctx.room.name,
    }

    # Create session with Gemini Live API (speech-to-speech)
    # No separate STT, TTS, or turn detection needed - all handled by Gemini Live
    session = AgentSession(
        llm=google.beta.realtime.RealtimeModel(
            model="gemini-2.0-flash-exp",
            voice="Puck",  # Available voices: Puck, Charon, Kore, Fenrir, Aoede
            temperature=0.8,
            instructions=AGENT_INSTRUCTIONS,
            _gemini_tools=[types.GoogleSearch()],  # Optional: Enable Google Search
        ),
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

    # Shutdown callbacks are triggered when the session is over
    ctx.add_shutdown_callback(log_usage)

    # Start the session
    await session.start(
        agent=Assistant(),
        room=ctx.room,
        room_input_options=RoomInputOptions(
            # LiveKit Cloud enhanced noise cancellation (optional)
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
