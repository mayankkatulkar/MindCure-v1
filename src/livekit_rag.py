from dotenv import load_dotenv
from llama_index.core import (
    SimpleDirectoryReader,
    StorageContext,
    VectorStoreIndex,
    load_index_from_storage,
)
from pathlib import Path
import logging

logger = logging.getLogger("livekit_rag")

load_dotenv(".env.local")

# RAG with Livekit
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


async def livekit_rag(query: str):
    logger.info(f"Querying info for {query}")
    query_engine = index.as_query_engine(use_async=True)
    res = await query_engine.aquery(query)
    return str(res)
