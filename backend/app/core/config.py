from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    # Application
    PROJECT_NAME: str = "AgentFlow"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"
    
    # API
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    JWT_SECRET: str = "your-jwt-secret-here-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ENCRYPTION_KEY: str = "your-encryption-key-here"
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://agentflow:agentflow@localhost:5432/agentflow"
    SUPABASE_URL: Optional[str] = None
    SUPABASE_ANON_KEY: Optional[str] = None
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None
    SUPABASE_DB_URL: Optional[str] = None  # Direct database connection for migrations
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    REDIS_PASSWORD: Optional[str] = None
    
    # CORS
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1", "0.0.0.0"]
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "https://localhost:3000",
        "http://localhost",
        "https://localhost"
    ]
    
    # Rate Limiting
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_REQUESTS_PER_MINUTE: int = 60
    RATE_LIMIT_BURST: int = 10
    
    # AI/LLM
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    LANGCHAIN_API_KEY: Optional[str] = None
    
    # External Services
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USERNAME: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_TLS: bool = True
    SMTP_SSL: bool = False
    
    # File Storage
    STORAGE_TYPE: str = "local"  # local, s3, gcs
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_S3_BUCKET: Optional[str] = None
    AWS_REGION: str = "us-east-1"
    
    # Monitoring
    MONITORING_ENABLED: bool = True
    PROMETHEUS_ENABLED: bool = True
    GRAFANA_ENABLED: bool = True
    SENTRY_DSN: Optional[str] = None
    LOG_FORMAT: str = "json"
    AUDIT_LOGGING_ENABLED: bool = True
    
    # Workflow Execution
    MAX_CONCURRENT_EXECUTIONS: int = 100
    EXECUTION_TIMEOUT_SECONDS: int = 3600
    AGENT_TIMEOUT_SECONDS: int = 300
    MAX_RETRIES: int = 3
    RETRY_DELAY_SECONDS: int = 5
    
    # WebSocket
    WS_HEARTBEAT_INTERVAL: int = 30
    WS_CONNECTION_TIMEOUT: int = 60
    WS_MAX_CONNECTIONS_PER_USER: int = 5
    
    # Development
    HOT_RELOAD: bool = True
    AUTO_MIGRATE: bool = True
    CREATE_SAMPLE_DATA: bool = True
    ENABLE_DEBUG_TOOLBAR: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()

# Update CORS origins from environment variable if provided
if os.getenv("BACKEND_CORS_ORIGINS"):
    settings.BACKEND_CORS_ORIGINS = [
        origin.strip() 
        for origin in os.getenv("BACKEND_CORS_ORIGINS").split(",")
    ]
