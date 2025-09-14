import logging
import sys
from typing import Any, Dict
import structlog
from app.core.config import settings

def setup_logging():
    """Setup structured logging configuration"""
    
    # Configure structlog
    structlog.configure(
        processors=[
            structlog.stdlib.filter_by_level,
            structlog.stdlib.add_logger_name,
            structlog.stdlib.add_log_level,
            structlog.stdlib.PositionalArgumentsFormatter(),
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
            structlog.processors.JSONRenderer() if settings.LOG_FORMAT == "json" else structlog.dev.ConsoleRenderer()
        ],
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )

    # Configure standard library logging
    logging.basicConfig(
        format="%(message)s",
        stream=sys.stdout,
        level=getattr(logging, settings.LOG_LEVEL.upper()),
    )

    # Set specific loggers
    logging.getLogger("uvicorn").setLevel(logging.INFO)
    logging.getLogger("uvicorn.access").setLevel(logging.INFO)
    logging.getLogger("sqlalchemy.engine").setLevel(
        logging.INFO if settings.DEBUG else logging.WARNING
    )
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("openai").setLevel(logging.WARNING)

    # Create logger
    logger = structlog.get_logger(__name__)
    logger.info("Logging configured", level=settings.LOG_LEVEL, format=settings.LOG_FORMAT)

def get_logger(name: str) -> structlog.BoundLogger:
    """Get a structured logger instance"""
    return structlog.get_logger(name)

# Audit logging for security events
async def log_audit_event(
    event_type: str,
    user_id: str = None,
    resource: str = None,
    action: str = None,
    details: Dict[str, Any] = None,
    ip_address: str = None,
    user_agent: str = None
):
    """Log security and audit events"""
    if not settings.AUDIT_LOGGING_ENABLED:
        return
    
    logger = get_logger("audit")
    
    audit_data = {
        "event_type": event_type,
        "timestamp": structlog.processors.TimeStamper(fmt="iso")(None, None, None),
        "details": details or {}
    }
    
    if user_id:
        audit_data["user_id"] = user_id
    if resource:
        audit_data["resource"] = resource
    if action:
        audit_data["action"] = action
    if ip_address:
        audit_data["ip_address"] = ip_address
    if user_agent:
        audit_data["user_agent"] = user_agent
    
    logger.info("audit_event", **audit_data)

# Performance logging
async def log_performance(
    operation: str,
    duration_ms: float,
    success: bool = True,
    details: Dict[str, Any] = None
):
    """Log performance metrics"""
    logger = get_logger("performance")
    
    logger.info(
        "performance_metric",
        operation=operation,
        duration_ms=duration_ms,
        success=success,
        details=details or {}
    )








