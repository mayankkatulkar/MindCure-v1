# 📚 Documentation Index

Voice AI Agent (LiveKit and RAG with Llamaindex ) documentation! This index provides a comprehensive overview of all documentation files and their purposes.


## 🚀 Quick Start: Run

To build and start all services (backend and frontend) using Docker Compose from the root directory, run:

```bash
git clone https://github.com/shubhamshinde245/LiveKit-Llamaindex-Open-Template.git
```

### Root folder ( Backend )
```bash
uv sync
cp .env.example .env.local
```
Set up the environment by copying `.env.example` to `.env.local` and filling in the required values:

- `LIVEKIT_URL`: Use [LiveKit Cloud](https://cloud.livekit.io/) or [run your own](https://docs.livekit.io/home/self-hosting/)
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`
- `OPENAI_API_KEY`: [Get a key](https://platform.openai.com/api-keys) or use your [preferred LLM provider](https://docs.livekit.io/agents/integrations/llm/)
- `DEEPGRAM_API_KEY`: [Get a key](https://console.deepgram.com/) or use your [preferred STT provider](https://docs.livekit.io/agents/integrations/stt/)
- `CARTESIA_API_KEY`: [Get a key](https://play.cartesia.ai/keys) or use your [preferred TTS provider](https://docs.livekit.io/agents/integrations/tts/)


```bash
uv run python src/agent.py download-files
python src/agents.py dev
```
### Frontend ( 2nd terminal )
```bash
cd frontend && pnpm dev
```

## 🗂️ Documentation Structure

```
📁 Complete Documentation Tree
├── 📄 [README.md](./README.md)                    # 🏠 Main project overview & quick start
├── 📄 [DOCUMENTATION.md](./DOCUMENTATION.md)      # 📋 This file - Documentation index
├── 📄 [FILE_STRUCTURE.md](./FILE_STRUCTURE.md)    # 📁 Complete file structure guide
├── 📄 [README_backend.md](./README_backend.md)    # 🐍 Backend Python implementation
├── 📄 [frontend/README.md](./frontend/README.md)  # ⚛️ Frontend Next.js application
├── 📄 [IMPROVEMENTS.md](./IMPROVEMENTS.md)        # 🔄 Recent improvements & notes
├── 📄 [LICENSE](./LICENSE)                        # 📄 MIT License
└── 📁 Additional Resources
    ├── 📄 [pyproject.toml](./pyproject.toml)      # 🐍 Python project configuration
    ├── 📄 [frontend/package.json](./frontend/package.json) # ⚛️ Node.js dependencies
    └── 📄 [taskfile.yaml](./taskfile.yaml)        # ⚡ Task automation
```

## 📖 Documentation Files Overview

### 🏠 Main Documentation

| File | Purpose | Audience | Key Topics |
|------|---------|----------|------------|
| **[README.md](./README.md)** | Main project overview and quick start guide | New users, developers | Quick setup, architecture overview, feature summary |
| **[DOCUMENTATION.md](./DOCUMENTATION.md)** | This file - Documentation navigation hub | All users | Complete documentation structure and navigation |
| **[FILE_STRUCTURE.md](./FILE_STRUCTURE.md)** | Complete file structure guide | Developers, maintainers | File organization, naming conventions, directory purposes |

### 🐍 Backend Documentation

| File | Purpose | Audience | Key Topics |
|------|---------|----------|------------|
| **[README_backend.md](./README_backend.md)** | Complete Python backend implementation guide | Backend developers | Voice AI pipeline, RAG systems, API endpoints, deployment |

### ⚛️ Frontend Documentation

| File | Purpose | Audience | Key Topics |
|------|---------|----------|------------|
| **[frontend/README.md](./frontend/README.md)** | Next.js application implementation guide | Frontend developers | React components, LiveKit integration, UI customization |

### 🔄 Development & Updates

| File | Purpose | Audience | Key Topics |
|------|---------|----------|------------|
| **[IMPROVEMENTS.md](./IMPROVEMENTS.md)** | Recent improvements and implementation notes | Developers, maintainers | Turn detection optimization, RAG architecture, unresolved features |

### 📄 Legal & Configuration

| File | Purpose | Audience | Key Topics |
|------|---------|----------|------------|
| **[LICENSE](./LICENSE)** | MIT License terms | All users | Usage rights and restrictions |
| **[pyproject.toml](./pyproject.toml)** | Python project configuration | Backend developers | Dependencies, build settings |
| **[frontend/package.json](./frontend/package.json)** | Node.js dependencies | Frontend developers | NPM packages, scripts |
| **[taskfile.yaml](./taskfile.yaml)** | Task automation | Developers | Build, test, and deployment tasks |

## 🎯 Quick Navigation by Use Case

### 🚀 Getting Started
1. **[README.md](./README.md)** - Main overview and quick start
2. **[README_backend.md](./README_backend.md)** - Backend setup details
3. **[frontend/README.md](./frontend/README.md)** - Frontend setup details

### 🛠️ Development
1. **[README_backend.md](./README_backend.md)** - Backend implementation
2. **[frontend/README.md](./frontend/README.md)** - Frontend implementation
3. **[IMPROVEMENTS.md](./IMPROVEMENTS.md)** - Recent changes and notes

### 🔧 Configuration
1. **[pyproject.toml](./pyproject.toml)** - Python dependencies
2. **[frontend/package.json](./frontend/package.json)** - Node.js dependencies
3. **[taskfile.yaml](./taskfile.yaml)** - Automation tasks

### 📚 Deep Dive
1. **[README_backend.md](./README_backend.md)** - Backend architecture
2. **[frontend/README.md](./frontend/README.md)** - Frontend architecture
3. **[IMPROVEMENTS.md](./IMPROVEMENTS.md)** - Implementation details

## 🔍 Search by Topic

### Voice AI & LiveKit
- **[README.md](./README.md)** - Overview of voice AI capabilities
- **[README_backend.md](./README_backend.md)** - Voice AI pipeline implementation
- **[frontend/README.md](./frontend/README.md)** - LiveKit integration

### RAG (Retrieval-Augmented Generation)
- **[README_backend.md](./README_backend.md)** - Dual RAG system architecture
- **[IMPROVEMENTS.md](./IMPROVEMENTS.md)** - RAG implementation notes

### File Upload & Management
- **[README_backend.md](./README_backend.md)** - File upload API documentation
- **[frontend/README.md](./frontend/README.md)** - File upload UI components

### Deployment & Production
- **[README.md](./README.md)** - Docker and cloud deployment
- **[README_backend.md](./README_backend.md)** - Backend deployment guide
- **[frontend/README.md](./frontend/README.md)** - Frontend deployment

### Testing & Development
- **[README.md](./README.md)** - Testing instructions
- **[taskfile.yaml](./taskfile.yaml)** - Development tasks

## 📝 Documentation Standards

### File Naming Convention
- `README.md` - Main documentation for each component
- `DOCUMENTATION.md` - Documentation index and navigation
- `IMPROVEMENTS.md` - Development notes and updates
- `LICENSE` - Legal documentation

### Content Structure
Each documentation file follows a consistent structure:
1. **Overview** - Purpose and scope
2. **Features** - Key capabilities
3. **Setup** - Installation and configuration
4. **Usage** - How to use the component
5. **Architecture** - Technical details
6. **Deployment** - Production setup
7. **Contributing** - Development guidelines

### Cross-References
- All documentation files are cross-linked
- Navigation breadcrumbs in each file
- Consistent terminology across files
- Clear separation of concerns

## 🔄 Documentation Maintenance

### Update Process
1. **Feature Updates**: Update relevant README files
2. **Architecture Changes**: Update both backend and frontend docs
3. **Improvements**: Document in IMPROVEMENTS.md
4. **Breaking Changes**: Update all affected documentation

### Review Schedule
- **Monthly**: Review and update main README files
- **Quarterly**: Comprehensive documentation audit
- **Release**: Update version-specific documentation

## 🤝 Contributing to Documentation

### Guidelines
1. **Keep it organized**: Follow the established structure
2. **Cross-reference**: Link to related documentation
3. **Be concise**: Focus on essential information
4. **Include examples**: Provide practical code samples
5. **Update consistently**: Maintain all related files

### Adding New Documentation
1. Create the new documentation file
2. Update this index file
3. Add cross-references to related files
4. Follow the established naming conventions

---

**📚 Complete Documentation Navigation:**
- [🏠 Main Overview](./README.md)
- [📋 Documentation Index](./DOCUMENTATION.md)
- [📁 File Structure Guide](./FILE_STRUCTURE.md)
- [🐍 Backend Guide](./README_backend.md)
- [⚛️ Frontend Guide](./frontend/README.md)
- [🔄 Recent Updates](./IMPROVEMENTS.md)
- [📄 License](./LICENSE) 

## 🐳 Docker Deployment

This section covers how to build and run the application using Docker containers for both development and production environments.

### 🏗️ Building Docker Images

#### Backend (Python Agent)

The backend uses a multi-stage Docker build optimized for Python applications:

```bash
# Build the backend image
docker build -t voice-agent .
```

**Key Features:**
- Uses UV Python package manager for faster dependency resolution
- Non-privileged user (`appuser`) for security
- Pre-downloads ML models during build
- Optimized for production with health checks

**Build Configuration:**
- Base image: `ghcr.io/astral-sh/uv:python3.11-bookworm-slim`
- Exposed port: `8081` (health check)
- Working directory: `/home/appuser`
- Dependencies installed via `uv sync --locked`

#### Frontend (Next.js)

The frontend uses a Node.js-based build optimized for Next.js applications:

```bash
# Build the frontend image
cd frontend
docker build -t voice-frontend .
```

**Key Features:**
- Uses Node.js 18 Alpine for smaller image size
- PNPM for faster package management
- Production build with optimized assets
- Exposed port: `3000`

### 🚀 Running with Docker Compose

#### Complete Application Stack

Use the root `docker-compose.yml` to run the backend agent:

```bash
# Start the backend agent
docker-compose up --build
```

#### Frontend Only

Use the frontend-specific `docker-compose.yml`:

```bash
# Start the frontend
cd frontend
docker-compose up --build
```

#### Environment Configuration

Create `.env.local` files for both services:

**Backend (.env.local):**
```bash
LIVEKIT_URL=your_livekit_url
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
OPENAI_API_KEY=your_openai_key
DEEPGRAM_API_KEY=your_deepgram_key
CARTESIA_API_KEY=your_cartesia_key
```

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_LIVEKIT_URL=your_livekit_url
NEXT_PUBLIC_API_URL=http://localhost:8081
```

### 🔧 Docker Development Workflow

#### Development Mode

For development with hot reloading:

```bash
# Backend development
docker run -it --rm \
  -p 8081:8081 \
  -v $(pwd)/src:/home/appuser/src \
  -e PYTHONPATH=/home/appuser \
  voice-agent uv run python src/agent.py dev

# Frontend development
cd frontend
docker run -it --rm \
  -p 3000:3000 \
  -v $(pwd):/app \
  -v /app/node_modules \
  voice-frontend pnpm dev
```

### 📊 Container Health Monitoring

#### Backend Health Check

The backend container includes a health check endpoint:

```bash
# Check backend health
curl http://localhost:8081/health

# View container health status
docker ps
```

#### Frontend Health Check

The frontend serves on port 3000:

```bash
# Check frontend availability
curl http://localhost:3000

# View container status
docker ps
```

### 🛠️ Docker Troubleshooting

#### Common Issues

**Port Conflicts:**
```bash
# Check what's using the ports
lsof -i :8081
lsof -i :3000

# Use different ports
docker run -p 8082:8081 voice-agent
```



### 🔒 Security Best Practices

#### Container Security

- **Non-privileged user**: Backend runs as `appuser` instead of root
- **Minimal base images**: Uses slim variants to reduce attack surface
- **Dependency locking**: Uses `uv.lock` for reproducible builds
- **Health checks**: Monitors container health automatically