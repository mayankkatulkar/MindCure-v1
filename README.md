# 🎤 Voice AI Agent Starter - Complete Documentation

A comprehensive voice AI application built with LiveKit Agents, featuring real-time voice interaction, advanced RAG capabilities, file management, and a modern web frontend.

## 📚 Documentation Tree

```
📁 Project Documentation
├── 📄 [README.md](./README.md) (This file) - Main project overview & quick start
├── 📄 [DOCUMENTATION.md](./DOCUMENTATION.md) - Complete documentation index & navigation
├── 📄 [FILE_STRUCTURE.md](./FILE_STRUCTURE.md) - Complete file structure guide
├── 📄 [README_backend.md](./README_backend.md) - Backend Python implementation details
├── 📄 [frontend/README.md](./frontend/README.md) - Frontend Next.js application guide
├── 📄 [IMPROVEMENTS.md](./IMPROVEMENTS.md) - Recent improvements & implementation notes
└── 📄 [LICENSE](./LICENSE) - MIT License
```

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- LiveKit Cloud account or self-hosted LiveKit server

### 1. Backend Setup
```bash
# Clone and install dependencies
git clone <repository-url>
cd agent-starter-python
uv sync

# Configure environment
cp .env.example .env.local
# Fill in your API keys (see README_backend.md for details)

# Download required models
uv run python src/agent.py download-files

# Start the agent
uv run python src/agent.py dev
```

### 2. Frontend Setup
```bash
# Install dependencies
cd frontend
pnpm install

# Configure environment
cp .env.example .env.local
# Add your LiveKit credentials

# Start development server
pnpm dev
```

### 3. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## 🏗️ Architecture Overview

### Backend Components
- **Voice AI Pipeline**: OpenAI LLM + Cartesia TTS + Deepgram STT
- **Dual RAG System**: Direct RAG + Multi-Agent RAG with LlamaIndex
- **File Upload System**: Document processing for RAG capabilities
- **Turn Detection**: Contextually-aware speaker detection
- **Noise Cancellation**: LiveKit Cloud enhanced audio processing

### Frontend Components
- **Real-time Voice Interface**: LiveKit JavaScript SDK integration
- **File Management**: Drag-and-drop upload with progress tracking
- **Call Traces**: Debug and monitor agent interactions
- **Modern UI**: Light/dark theme with customizable branding
- **Video Support**: Camera streaming and screen sharing

## 📁 Project Structure

```
agent-starter-python/
├── 📄 [README.md](./README.md)                    # Main documentation (this file)
├── 📄 [README_backend.md](./README_backend.md)    # Backend implementation guide
├── 📄 [IMPROVEMENTS.md](./IMPROVEMENTS.md)        # Recent improvements & notes
├── 📄 [LICENSE](./LICENSE)                        # MIT License
├── 📁 src/                                        # Python backend
│   ├── agent.py                                   # Main agent implementation
│   ├── livekit_rag.py                            # Direct RAG integration
│   ├── llamaindex_rag.py                         # Multi-agent RAG system
│   ├── recreate_rag.py                           # RAG system recreation
│   ├── prompts.py                                # Agent prompts
│   ├── utils.py                                  # Utility functions
│   └── data/                                     # Uploaded documents storage
├── 📁 frontend/                                   # Next.js web application
│   ├── 📄 [README.md](./frontend/README.md)      # Frontend implementation guide
│   ├── app/                                       # Next.js app directory
│   ├── components/                                # React components
│   │   ├── livekit/                              # LiveKit-specific components
│   │   ├── upload/                               # File upload components
│   │   └── call-traces/                          # Call tracing components
│   └── public/                                   # Static assets
├── 📁 tests/                                      # Test suite
├── 📄 Dockerfile                                 # Production deployment
└── 📄 docker-compose.yml                         # Docker configuration
```

## 🔧 Key Features

### Voice AI Capabilities
- **Real-time Voice Interaction**: Seamless conversation with AI agent
- **Multi-language Support**: Turn detection optimized for English
- **Noise Cancellation**: Enhanced audio quality with LiveKit Cloud
- **Auto-join**: Automatic room connection with audio-only subscription

### RAG (Retrieval-Augmented Generation)
- **Dual Architecture**: 
  - Direct RAG for quick tasks
  - Multi-Agent RAG for complex reasoning
- **File Upload System**: Support for PDF, Word, Excel, CSV, TXT
- **Knowledge Base**: Dynamic document processing and querying

### Development & Monitoring
- **Call Traces**: Comprehensive debugging and analytics
- **File Management**: Drag-and-drop interface with progress tracking
- **Modern UI**: Responsive design with theme switching
- **TypeScript**: Full type safety throughout frontend

## 📖 Detailed Documentation

### Backend Documentation
📄 **[README_backend.md](./README_backend.md)**
- Complete Python backend implementation guide
- Voice AI pipeline configuration
- RAG system architecture details
- File upload system API documentation
- Deployment and production setup

### Frontend Documentation
📄 **[frontend/README.md](./frontend/README.md)**
- Next.js application implementation
- LiveKit integration guide
- Component architecture and structure
- Configuration and customization options
- Development and deployment instructions

### Recent Improvements
📄 **[IMPROVEMENTS.md](./IMPROVEMENTS.md)**
- Turn detection optimization
- Auto-join room implementation
- Welcome message system
- Dual RAG architecture details
- Implementation notes and unresolved features

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker
docker build -t voice-agent .
docker compose up
```

### LiveKit Cloud
Deploy directly to LiveKit Cloud using the provided configuration files.

### AWS Deployment
Use AWS Copilot for cloud deployment:
```bash
copilot init
# Select "Worker Service" type
# Configure environment variables in manifest.yml
```

## 🧪 Testing

```bash
# Run backend tests
uv run pytest

# Run frontend tests
cd frontend
pnpm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support

- [LiveKit Documentation](https://docs.livekit.io/agents)
- [LiveKit Community Slack](https://livekit.io/join-slack)
- [GitHub Issues](https://github.com/your-repo/issues)

---

**Quick Links:**
- [📋 Documentation Index](./DOCUMENTATION.md) - Complete documentation navigation
- [📁 File Structure Guide](./FILE_STRUCTURE.md) - Detailed file organization
- [🐍 Backend Guide](./README_backend.md) - Python implementation details
- [⚛️ Frontend Guide](./frontend/README.md) - Next.js application guide
- [🔄 Recent Improvements](./IMPROVEMENTS.md) - Latest updates and notes 