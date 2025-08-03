# LiveKit Agents Starter - Python

A complete starter project for building voice AI applications with [LiveKit Agents for Python](https://github.com/livekit/agents), featuring advanced RAG (Retrieval-Augmented Generation) capabilities and a modern web frontend.

## 🚀 Features

### Backend (Python)
- **Voice AI Assistant**: Real-time voice interaction with OpenAI, Cartesia TTS, and Deepgram STT
- **Advanced RAG System**: Dual RAG architecture for different use cases:
  - **Direct RAG**: Quick tasks with LiveKit RAG integration
  - **Multi-Agent RAG**: Complex reasoning tasks using LlamaIndex with internal tools
- **File Upload System**: Upload and process documents (PDF, Word, Excel, CSV, TXT)
- **Turn Detection**: Contextually-aware speaker detection with English model optimization
- **Noise Cancellation**: LiveKit Cloud enhanced noise cancellation
- **Auto-join**: Automatic room connection with audio-only subscription
- **Welcome Messages**: Greeting system with capability descriptions

### Frontend (Next.js)
- **Real-time Voice Interface**: LiveKit JavaScript SDK integration
- **File Management**: Drag-and-drop file upload with progress tracking
- **Call Traces**: Debug and monitor agent interactions
- **Modern UI**: Light/dark theme with customizable branding
- **Video Support**: Camera streaming and screen sharing capabilities
- **Virtual Avatars**: Avatar integration for enhanced user experience

## 📁 Project Structure

```
agent-starter-python/
├── src/                          # Python backend
│   ├── agent.py                  # Main agent implementation
│   ├── livekit_rag.py           # Direct RAG integration
│   ├── llamaindex_rag.py        # Multi-agent RAG system
│   ├── recreate_rag.py          # RAG system recreation
│   ├── prompts.py               # Agent prompts
│   ├── utils.py                 # Utility functions
│   └── data/                    # Uploaded documents storage
├── frontend/                     # Next.js web application
│   ├── app/                     # Next.js app directory
│   ├── components/              # React components
│   │   ├── livekit/            # LiveKit-specific components
│   │   ├── upload/             # File upload components
│   │   └── call-traces/        # Call tracing components
│   └── public/                 # Static assets
├── tests/                       # Test suite
└── Dockerfile                   # Production deployment
```

## 🛠️ Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- LiveKit Cloud account or self-hosted LiveKit server

### Backend Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd agent-starter-python
   uv sync
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in the required values:
   ```env
   LIVEKIT_URL=your_livekit_url
   LIVEKIT_API_KEY=your_api_key
   LIVEKIT_API_SECRET=your_api_secret
   OPENAI_API_KEY=your_openai_key
   DEEPGRAM_API_KEY=your_deepgram_key
   CARTESIA_API_KEY=your_cartesia_key
   ```

3. **Download required models:**
   ```bash
   uv run python src/agent.py download-files
   ```

4. **Run the agent:**
   ```bash
   # Console mode (terminal interaction)
   uv run python src/agent.py console
   
   # Development mode (for frontend/telephony)
   uv run python src/agent.py dev
   
   # Production mode
   uv run python src/agent.py start
   ```

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   pnpm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your LiveKit credentials:
   ```env
   LIVEKIT_API_KEY=your_api_key
   LIVEKIT_API_SECRET=your_api_secret
   LIVEKIT_URL=your_livekit_url
   ```

3. **Start the development server:**
   ```bash
   pnpm dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🔧 RAG System

This project implements a sophisticated dual RAG architecture:

### Direct RAG (livekit_rag.py)
- **Purpose**: Quick, direct document queries
- **Use Case**: Simple Q&A from uploaded documents
- **Integration**: Direct LiveKit RAG tool integration

### Multi-Agent RAG (llamaindex_rag.py)
- **Purpose**: Complex reasoning and task execution
- **Use Case**: Deep analysis, multi-step reasoning, tool usage
- **Features**: 
  - Internal tool access
  - Multi-agent coordination
  - Advanced reasoning capabilities

## 📁 File Upload System

### Supported Formats
- PDF files (.pdf)
- Microsoft Word (.doc, .docx)
- Text files (.txt)
- CSV files (.csv)
- Excel files (.xls, .xlsx)

### API Endpoints
- `POST /api/upload` - Upload files
- `GET /api/upload` - List uploaded files
- `DELETE /api/upload` - Clear all files

### Features
- Drag-and-drop interface
- File type validation
- Size limits (50MB per file)
- Progress tracking
- Real-time file management

## 🧪 Testing

Run the complete test suite:

```bash
uv run pytest
```

## 🚀 Deployment

### Docker Deployment
The project includes a production-ready Dockerfile:

```bash
docker build -t agent-starter-python .
docker run -p 8000:8000 agent-starter-python
```

### LiveKit Cloud
Deploy directly to LiveKit Cloud using the provided configuration files.

## 🔧 Configuration

### Backend Configuration
Customize agent behavior in `src/prompts.py` and `src/agent.py`.

### Frontend Configuration
Modify `frontend/app-config.ts` for branding and feature customization:

```typescript
export const APP_CONFIG_DEFAULTS = {
  companyName: 'Your Company',
  pageTitle: 'Your Voice Assistant',
  supportsChatInput: true,
  supportsVideoInput: true,
  // ... more options
};
```

## 📊 Monitoring

### Call Traces
- Real-time call monitoring
- Debug agent interactions
- Performance metrics
- Error tracking

### Metrics
- Turn detection latency
- Response times
- File processing statistics
- RAG query performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- [LiveKit Documentation](https://docs.livekit.io/agents)
- [LiveKit Community Slack](https://livekit.io/join-slack)
- [GitHub Issues](https://github.com/your-repo/issues)

## 🔄 Recent Improvements

- Optimized turn detection for better latency
- Auto-join room with audio-only subscription
- Welcome message system
- Dual RAG architecture implementation
- Enhanced file upload system
- Improved error handling and logging 