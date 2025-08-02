Changed turn detection from turn_detection=MultilingualModel() to turn_detection=EnglishModel() to improve Per Turn Latency and reduce size on disk 

Auto join the room with audio
await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

Greet user with welcome message and what can be helped with.

Tried 3 hrs to ensure there is a KEYBOARD_TYPING audio while thinking, was not ab;e to make it work.
Even the gihub repo they have doesn't make the typing sound where they demo how to use it  https://github.com/livekit/agents/blob/main/examples/voice_agents/background_audio.py

Created 2 RAG models:
One with Direct tool call with RAG from livekit for quick tasks
Second with RAG tool to multi agent architecture from llamaindex, think of this as RAG model having access to internal tools and tasks which need deep reasoning.