# AgentFlow - Visual Multi-Agent Workflow Designer

AgentFlow is a powerful visual workflow designer that allows users to create, manage, and execute multi-agent AI workflows through an intuitive drag-and-drop interface.

## 🌟 Features

### Core Functionality
- **Visual Workflow Designer**: Drag-and-drop interface for creating complex AI workflows
- **Multi-Agent Support**: Chain multiple AI agents together in sophisticated workflows
- **Real-time Execution**: Execute workflows and monitor progress in real-time
- **Template Library**: Pre-built workflow templates for common use cases
- **Agent Marketplace**: Discover and share custom AI agents

### Community Features
- **Community Forum**: Discuss workflows, share knowledge, and get help
- **Leaderboard**: Track top contributors and active community members
- **Events**: Join community events and workshops
- **User Reputation**: Earn reputation points for helpful contributions
- **Badges**: Unlock achievement badges for various accomplishments

### Technical Features
- **Modern Tech Stack**: Built with React, TypeScript, FastAPI, and Supabase
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: WebSocket support for live workflow execution updates
- **Authentication**: Secure user authentication with Supabase Auth
- **Database**: PostgreSQL with Row Level Security (RLS)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.9+
- PostgreSQL (or use Supabase)
- npm or yarn

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Environment Variables
Create `.env` files in both frontend and backend directories:

**Frontend (.env):**
```
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Backend (.env):**
```
DATABASE_URL=your_database_url
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_key
JWT_SECRET=your_jwt_secret
```

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for client-side routing
- **Zustand** for state management
- **ReactFlow** for workflow visualization
- **Tailwind CSS** for styling
- **Lucide React** for icons

### Backend
- **FastAPI** for the API server
- **SQLAlchemy** with asyncpg for database operations
- **Supabase** for authentication and database
- **Pydantic** for data validation
- **WebSocket** for real-time updates
- **JWT** for authentication

### Database Schema
- **Users**: User profiles and authentication
- **Workflows**: Workflow definitions and metadata
- **Agents**: AI agent configurations
- **Executions**: Workflow execution history
- **Community**: Forum posts, comments, reputation, badges

## 📁 Project Structure

```
AgentFlow/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Application pages
│   │   ├── stores/          # Zustand state stores
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   └── contexts/        # React contexts
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # FastAPI backend application
│   ├── app/
│   │   ├── api/            # API route handlers
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   └── agents/         # AI agent implementations
│   ├── database/           # Database migrations and schemas
│   └── main.py
├── docs/                   # Documentation
└── README.md
```

## 🤖 AI Agents

AgentFlow comes with several built-in AI agents:

- **Text Generator**: Generate text using various LLMs
- **Chat Agent**: Conversational AI agent
- **Text Summarizer**: Summarize long texts
- **Translator**: Translate text between languages
- **Data Processor**: Process and transform data
- **API Caller**: Make HTTP requests to external APIs
- **Email Sender**: Send emails programmatically
- **File Handler**: Read and write files
- **Database Query**: Execute database queries

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/profile` - Get user profile

### Workflows
- `GET /api/workflows` - List workflows
- `POST /api/workflows` - Create workflow
- `GET /api/workflows/{id}` - Get workflow details
- `PUT /api/workflows/{id}` - Update workflow
- `DELETE /api/workflows/{id}` - Delete workflow
- `POST /api/workflows/{id}/execute` - Execute workflow

### Community
- `GET /api/community/posts` - List forum posts
- `POST /api/community/posts` - Create forum post
- `GET /api/community/leaderboard` - Get leaderboard
- `GET /api/community/events` - List community events

## 🎨 Design System

AgentFlow uses a custom design system with:

- **AgentFlowCard**: Consistent card components with gradient borders
- **AgentFlowButton**: Styled buttons with multiple variants
- **AgentFlowBadge**: Status and category badges
- **CSS Custom Properties**: Consistent spacing and color system
- **Responsive Grid**: Mobile-first responsive design

## 🧪 Development

### Running Tests
```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
pytest
```

### Code Quality
```bash
# Frontend linting
cd frontend
npm run lint

# Backend formatting
cd backend
black .
isort .
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [FastAPI](https://fastapi.tiangolo.com/)
- UI components inspired by modern design systems
- Community features inspired by successful open-source projects

## 📞 Support

- 📧 Email: support@agentflow.dev
- 💬 Discord: [Join our community](https://discord.gg/agentflow)
- 📖 Documentation: [docs.agentflow.dev](https://docs.agentflow.dev)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/agentflow/issues)

---

Made with ❤️ by the AgentFlow Team