# 📁 File Structure Guide

This guide provides a detailed explanation of every file and directory in the Voice AI Agent Starter project.

## 🏗️ Root Directory Structure

```
agent-starter-python/
├── 📄 Documentation Files
├── 📁 Backend (Python)
├── 📁 Frontend (Next.js)
├── 📁 Configuration & Build
├── 📁 Testing & Development
└── 📁 Deployment & Infrastructure
```

## 📄 Documentation Files

| File | Purpose | Description |
|------|---------|-------------|
| **[README.md](./README.md)** | Main project overview | Complete project introduction, quick start, and feature summary |
| **[DOCUMENTATION.md](./DOCUMENTATION.md)** | Documentation index | Central navigation hub for all documentation |
| **[README_backend.md](./README_backend.md)** | Backend implementation guide | Detailed Python backend documentation |
| **[frontend/README.md](./frontend/README.md)** | Frontend implementation guide | Next.js application documentation |
| **[IMPROVEMENTS.md](./IMPROVEMENTS.md)** | Development notes | Recent improvements and implementation details |
| **[LICENSE](./LICENSE)** | Legal terms | MIT License for the project |

## 🐍 Backend (Python) - `/src/`

### Core Agent Files

| File | Purpose | Description |
|------|---------|-------------|
| **`src/agent.py`** | Main agent implementation | Core voice AI agent with LiveKit integration |
| **`src/prompts.py`** | Agent prompts | Personality, greetings, and conversation prompts |
| **`src/utils.py`** | Utility functions | Helper functions for the agent |

### RAG (Retrieval-Augmented Generation) System

| File | Purpose | Description |
|------|---------|-------------|
| **`src/livekit_rag.py`** | Direct RAG integration | Quick document queries using LiveKit RAG |
| **`src/llamaindex_rag.py`** | Multi-agent RAG system | Complex reasoning with LlamaIndex |
| **`src/recreate_rag.py`** | RAG system recreation | Rebuilds RAG system with new documents |

### Data Storage

| Directory | Purpose | Description |
|-----------|---------|-------------|
| **`src/data/`** | Uploaded documents | Storage for user-uploaded files (PDF, DOCX, etc.) |

## ⚛️ Frontend (Next.js) - `/frontend/`

### App Structure

| Directory/File | Purpose | Description |
|----------------|---------|-------------|
| **`frontend/app/`** | Next.js app directory | Main application pages and API routes |
| **`frontend/app/(app)/`** | App pages | Main application pages (call traces, file upload) |
| **`frontend/app/api/`** | API routes | Backend API endpoints for frontend |
| **`frontend/app/layout.tsx`** | Root layout | Main application layout |
| **`frontend/app/page.tsx`** | Home page | Main application entry point |

### Components

| Directory | Purpose | Description |
|-----------|---------|-------------|
| **`frontend/components/`** | React components | All reusable UI components |
| **`frontend/components/livekit/`** | LiveKit components | Voice/video interaction components |
| **`frontend/components/upload/`** | File upload components | File management UI components |
| **`frontend/components/call-traces/`** | Call tracing components | Debug and analytics components |
| **`frontend/components/ui/`** | Base UI components | Reusable UI primitives (buttons, cards, etc.) |

### Configuration & Assets

| File | Purpose | Description |
|------|---------|-------------|
| **`frontend/app-config.ts`** | App configuration | Branding, features, and customization options |
| **`frontend/public/`** | Static assets | Images, fonts, and static files |
| **`frontend/fonts/`** | Custom fonts | Typography assets |

### Development Files

| File | Purpose | Description |
|------|---------|-------------|
| **`frontend/package.json`** | Node.js dependencies | Frontend dependencies and scripts |
| **`frontend/tsconfig.json`** | TypeScript config | TypeScript compilation settings |
| **`frontend/next.config.ts`** | Next.js config | Next.js framework configuration |
| **`frontend/tailwind.config.js`** | Tailwind CSS config | Styling framework configuration |

## ⚙️ Configuration & Build Files

### Python Configuration

| File | Purpose | Description |
|------|---------|-------------|
| **`pyproject.toml`** | Python project config | Dependencies, build settings, and metadata |
| **`uv.lock`** | Dependency lock file | Exact versions of Python packages |

### Node.js Configuration

| File | Purpose | Description |
|------|---------|-------------|
| **`frontend/package.json`** | Node.js project config | Dependencies, scripts, and metadata |
| **`frontend/pnpm-lock.yaml`** | Package lock file | Exact versions of npm packages |

### Build & Development

| File | Purpose | Description |
|------|---------|-------------|
| **`taskfile.yaml`** | Task automation | Build, test, and deployment tasks |
| **`frontend/.eslintrc.json`** | ESLint config | JavaScript/TypeScript linting rules |
| **`frontend/.prettierrc`** | Prettier config | Code formatting rules |

## 🧪 Testing & Development

### Test Files

| Directory/File | Purpose | Description |
|----------------|---------|-------------|
| **`tests/`** | Test suite | Python backend tests |
| **`tests/test_agent.py`** | Agent tests | Voice AI agent functionality tests |
| **`frontend/__tests__/`** | Frontend tests | React component tests (if exists) |

### Development Tools

| File | Purpose | Description |
|------|---------|-------------|
| **`.gitignore`** | Git ignore rules | Files to exclude from version control |
| **`frontend/.gitignore`** | Frontend git ignore | Frontend-specific exclusions |
| **`.dockerignore`** | Docker ignore rules | Files to exclude from Docker builds |

## 🚀 Deployment & Infrastructure

### Docker Configuration

| File | Purpose | Description |
|------|---------|-------------|
| **`Dockerfile`** | Backend container | Python backend Docker configuration |
| **`frontend/Dockerfile`** | Frontend container | Next.js frontend Docker configuration |
| **`docker-compose.yml`** | Multi-container setup | Complete application deployment |

### Cloud Deployment

| Directory/File | Purpose | Description |
|----------------|---------|-------------|
| **`copilot/`** | AWS Copilot config | AWS deployment configuration |
| **`.github/`** | GitHub Actions | CI/CD pipeline configuration |

## 📁 Directory Details

### `/src/` - Backend Core
- **`agent.py`**: Main voice AI agent implementation
- **`prompts.py`**: Agent personality and conversation prompts
- **`utils.py`**: Utility functions and helpers
- **`data/`**: User-uploaded document storage

### `/frontend/` - Frontend Application
- **`app/`**: Next.js 13+ app directory structure
- **`components/`**: Reusable React components
- **`public/`**: Static assets (images, fonts)
- **`hooks/`**: Custom React hooks
- **`lib/`**: Utility functions and types

### `/tests/` - Testing
- **`test_agent.py`**: Voice AI agent tests
- **`test_tool_names.py`**: Tool functionality tests

## 🔍 File Naming Conventions

### Python Files
- **snake_case**: All Python files use snake_case naming
- **Descriptive names**: Files clearly indicate their purpose
- **Module structure**: Related functionality grouped in modules

### JavaScript/TypeScript Files
- **camelCase**: React components and functions
- **PascalCase**: Component files and classes
- **kebab-case**: CSS files and utilities

### Configuration Files
- **Standard names**: Follow framework conventions (package.json, pyproject.toml)
- **Environment files**: .env.local, .env.example for configuration

## 📋 File Categories

### 🎯 Core Application Files
- Voice AI agent implementation
- Frontend React components
- API endpoints and routes

### 🔧 Configuration Files
- Project dependencies
- Build and deployment settings
- Environment configuration

### 📚 Documentation Files
- README files for each component
- Implementation guides
- Development notes

### 🧪 Testing Files
- Unit tests for backend
- Component tests for frontend
- Integration test suites

### 🚀 Deployment Files
- Docker configurations
- Cloud deployment settings
- CI/CD pipeline files

---

**📚 Related Documentation:**
- [📋 Documentation Index](./DOCUMENTATION.md) - Complete documentation navigation
- [🐍 Backend Guide](./README_backend.md) - Backend implementation details
- [⚛️ Frontend Guide](./frontend/README.md) - Frontend implementation details 