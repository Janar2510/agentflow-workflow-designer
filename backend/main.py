import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from prometheus_fastapi_instrumentator import Instrumentator

# Import API routes
from app.api import agents, auth, workflows, executions, templates, community

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("🚀 Starting AgentFlow API...")
    
    # Initialize database
    from app.core.database import init_db
    await init_db()
    
    logger.info("✅ AgentFlow API started successfully")
    yield
    # Shutdown
    logger.info("🛑 Shutting down AgentFlow API...")
    logger.info("✅ AgentFlow API shutdown complete")

# Create FastAPI app
app = FastAPI(
    title="AgentFlow API",
    description="Visual Multi-Agent Workflow Designer",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Setup monitoring
Instrumentator().instrument(app).expose(app)

# Include API routes
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(agents.router, prefix="/api/v1/agents", tags=["Agents"])
app.include_router(workflows.router, prefix="/api/v1/workflows", tags=["Workflows"])
app.include_router(executions.router, prefix="/api/v1/executions", tags=["Executions"])
app.include_router(templates.router, prefix="/api/v1/templates", tags=["Templates"])
app.include_router(community.router, prefix="/api/v1", tags=["Community"])

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "AgentFlow API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "environment": "development"
    }

@app.websocket("/ws/{workflow_id}")
async def websocket_endpoint(websocket: WebSocket, workflow_id: str):
    """WebSocket endpoint for real-time collaboration and execution monitoring"""
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            # Echo back for now
            await websocket.send_json({"echo": data})
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected from workflow {workflow_id}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)