from pathlib import Path
from dotenv import load_dotenv
from llama_index.core import (
    SimpleDirectoryReader,
    VectorStoreIndex,
    StorageContext,
    load_index_from_storage,
)
from llama_index.llms.openai import OpenAI
from llama_index.core.agent.workflow import FunctionAgent
from utils import get_doc_tools
import logging

load_dotenv(".env.local")

logger = logging.getLogger(__name__)

# Configuration
THIS_DIR = Path(__file__).parent
DATA_DIR = THIS_DIR / "data"  # or "src/data" based on your structure
PERSIST_DIR = THIS_DIR / "query-engine-storage"


def setup_persistent_index():
    """Set up or load the persistent vector index."""
    if not PERSIST_DIR.exists():
        logger.info("Creating new vector index...")
        # Load documents and create index
        documents = SimpleDirectoryReader(DATA_DIR).load_data()
        index = VectorStoreIndex.from_documents(documents)
        # Persist for later use
        index.storage_context.persist(persist_dir=PERSIST_DIR)
        logger.info(f"Index created and persisted to {PERSIST_DIR}")
    else:
        logger.info("Loading existing vector index...")
        # Load existing index
        storage_context = StorageContext.from_defaults(persist_dir=PERSIST_DIR)
        index = load_index_from_storage(storage_context)
        logger.info("Index loaded successfully")

    return index


def create_file_specific_tools():
    """Create vector and summary tools for each file."""
    file_to_tools_dict = {}

    if not DATA_DIR.exists():
        logger.warning(f"Data directory {DATA_DIR} does not exist")
        return {}, []

    for file in DATA_DIR.iterdir():
        if file.is_file():  # Only process files, not directories
            logger.info(f"Getting tools for file: {file}")
            try:
                vector_tool, summary_tool = get_doc_tools(file, file.stem)
                file_to_tools_dict[file] = [vector_tool, summary_tool]
            except Exception as e:
                logger.error(f"Error creating tools for {file}: {e}")

    # Flatten tools list
    initial_tools = [
        tool for tools_list in file_to_tools_dict.values() for tool in tools_list
    ]

    logger.info(
        f"Created {len(initial_tools)} tools from {len(file_to_tools_dict)} files"
    )
    return file_to_tools_dict, initial_tools


def create_index_query_tool(index):
    """Create a query tool from the persistent index."""
    from llama_index.core.tools import QueryEngineTool

    query_engine = index.as_query_engine()

    # Create a tool that can query the entire index
    index_tool = QueryEngineTool.from_defaults(
        query_engine=query_engine,
        name="query_all_documents",
        description="Query across all documents in the knowledge base. Use this for broad questions that might span multiple documents.",
    )

    return index_tool


def setup_combined_agent():
    """Set up the agent with both persistent index and file-specific tools (FunctionAgent)."""

    # Step 1: Set up persistent index
    index = setup_persistent_index()

    # Step 2: Create file-specific tools
    file_to_tools_dict, file_specific_tools = create_file_specific_tools()

    # Step 3: Create index query tool
    index_tool = create_index_query_tool(index)

    # Step 4: Combine all tools
    all_tools = [index_tool] + file_specific_tools

    # Step 5: Initialize LLM
    llm = OpenAI(model="gpt-4o-mini")

    # Step 6: Create enhanced system prompt
    system_prompt = """
    You are an intelligent document analysis agent with access to multiple types of tools:
    
    1. A comprehensive query tool that searches across ALL documents
    2. File-specific vector search tools for targeted document queries
    3. File-specific summary tools for document overviews
    
    Strategy for tool usage:
    - Use the 'query_all_documents' tool for broad questions spanning multiple documents
    - Use file-specific vector tools when you need precise information from a particular document
    - Use summary tools to get overviews of specific documents
    - You can combine results from multiple tools to provide comprehensive answers
    
    Always cite which documents or sources your information comes from.
    """

    # Step 7: Create Workflow Agent
    workflow = FunctionAgent(
        tools=all_tools,
        llm=llm,
        system_prompt=system_prompt,
    )

    logger.info(f"FunctionAgent created with {len(all_tools)} total tools")

    return workflow, index, file_to_tools_dict


def update_index_with_new_documents():
    """Update the persistent index when new documents are added."""
    # Load existing index
    storage_context = StorageContext.from_defaults(persist_dir=PERSIST_DIR)
    index = load_index_from_storage(storage_context)

    # Load new documents
    documents = SimpleDirectoryReader(DATA_DIR).load_data()

    # Add new documents to existing index
    for doc in documents:
        index.insert(doc)

    # Persist updated index
    index.storage_context.persist(persist_dir=PERSIST_DIR)

    logger.info("Index updated with new documents")
    return index


# Main execution
if __name__ == "__main__":
    import asyncio

    # Set up logging
    logging.basicConfig(level=logging.INFO)

    # Option 1: Use FunctionAgent (workflow-based, async)
    print("=== Setting up FunctionAgent (Workflow) ===")
    workflow_agent, index, file_tools = setup_combined_agent()

    print("\nAgent is ready! Available tools:")
    for tool in workflow_agent.tools:
        print(f"- {tool.metadata.name}: {tool.metadata.description}")

    # Example queries using the workflow agent (async)
    async def run_workflow_examples():
        try:
            print("\n--- Testing Workflow Agent ---")
            response = await workflow_agent.run(
                "Find specific information about 5 benchmark names and percentage in document in metagpt paper."
            )
            print(f"Workflow Response: {response}")

        except Exception as e:
            print(f"Error during workflow execution: {e}")

    # Uncomment to run workflow examples
    asyncio.run(run_workflow_examples())
