import asyncio
import json
import logging
from typing import Dict, List, Set
from fastapi import WebSocket
from datetime import datetime
import uuid

logger = logging.getLogger(__name__)

class ConnectionManager:
    """WebSocket connection manager for real-time collaboration and monitoring"""
    
    def __init__(self):
        # workflow_id -> set of websockets
        self.workflow_connections: Dict[str, Set[WebSocket]] = {}
        
        # websocket -> user info
        self.connection_info: Dict[WebSocket, Dict[str, str]] = {}
        
        # workflow_id -> cursor positions
        self.cursor_positions: Dict[str, Dict[str, Dict]] = {}
    
    async def connect(self, websocket: WebSocket, workflow_id: str, user_id: str = None):
        """Accept a new WebSocket connection"""
        await websocket.accept()
        
        # Add to workflow connections
        if workflow_id not in self.workflow_connections:
            self.workflow_connections[workflow_id] = set()
        self.workflow_connections[workflow_id].add(websocket)
        
        # Store connection info
        self.connection_info[websocket] = {
            "workflow_id": workflow_id,
            "user_id": user_id or str(uuid.uuid4()),
            "connected_at": datetime.utcnow().isoformat()
        }
        
        logger.info(f"WebSocket connected to workflow {workflow_id}")
        
        # Notify other users about new connection
        await self.broadcast_to_workflow(workflow_id, {
            "type": "user_joined",
            "user_id": self.connection_info[websocket]["user_id"],
            "timestamp": datetime.utcnow().isoformat()
        }, exclude=websocket)
    
    def disconnect(self, websocket: WebSocket, workflow_id: str):
        """Remove a WebSocket connection"""
        
        if workflow_id in self.workflow_connections:
            self.workflow_connections[workflow_id].discard(websocket)
            
            # Clean up empty workflow connection sets
            if not self.workflow_connections[workflow_id]:
                del self.workflow_connections[workflow_id]
        
        # Get user info before removing
        user_info = self.connection_info.get(websocket)
        
        # Remove connection info
        if websocket in self.connection_info:
            del self.connection_info[websocket]
        
        # Remove cursor position
        if workflow_id in self.cursor_positions and user_info:
            user_id = user_info["user_id"]
            if user_id in self.cursor_positions[workflow_id]:
                del self.cursor_positions[workflow_id][user_id]
        
        logger.info(f"WebSocket disconnected from workflow {workflow_id}")
        
        # Notify other users about disconnection
        if user_info:
            asyncio.create_task(self.broadcast_to_workflow(workflow_id, {
                "type": "user_left",
                "user_id": user_info["user_id"],
                "timestamp": datetime.utcnow().isoformat()
            }))
    
    async def handle_message(self, workflow_id: str, data: Dict):
        """Handle incoming WebSocket message"""
        
        message_type = data.get("type")
        
        if message_type == "cursor_update":
            await self._handle_cursor_update(workflow_id, data)
        elif message_type == "node_update":
            await self._handle_node_update(workflow_id, data)
        elif message_type == "workflow_save":
            await self._handle_workflow_save(workflow_id, data)
        elif message_type == "chat_message":
            await self._handle_chat_message(workflow_id, data)
        else:
            logger.warning(f"Unknown message type: {message_type}")
    
    async def _handle_cursor_update(self, workflow_id: str, data: Dict):
        """Handle cursor position updates for collaboration"""
        
        user_id = data.get("user_id")
        position = data.get("position")
        
        if not user_id or not position:
            return
        
        # Update cursor position
        if workflow_id not in self.cursor_positions:
            self.cursor_positions[workflow_id] = {}
        
        self.cursor_positions[workflow_id][user_id] = {
            "position": position,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Broadcast to other users
        await self.broadcast_to_workflow(workflow_id, {
            "type": "cursor_update",
            "user_id": user_id,
            "position": position,
            "timestamp": datetime.utcnow().isoformat()
        })
    
    async def _handle_node_update(self, workflow_id: str, data: Dict):
        """Handle real-time node updates during collaboration"""
        
        # Broadcast node updates to other users
        await self.broadcast_to_workflow(workflow_id, {
            "type": "node_update",
            "node_id": data.get("node_id"),
            "changes": data.get("changes"),
            "user_id": data.get("user_id"),
            "timestamp": datetime.utcnow().isoformat()
        })
    
    async def _handle_workflow_save(self, workflow_id: str, data: Dict):
        """Handle workflow save notifications"""
        
        await self.broadcast_to_workflow(workflow_id, {
            "type": "workflow_saved",
            "user_id": data.get("user_id"),
            "version": data.get("version"),
            "timestamp": datetime.utcnow().isoformat()
        })
    
    async def _handle_chat_message(self, workflow_id: str, data: Dict):
        """Handle chat messages during collaboration"""
        
        await self.broadcast_to_workflow(workflow_id, {
            "type": "chat_message",
            "user_id": data.get("user_id"),
            "message": data.get("message"),
            "timestamp": datetime.utcnow().isoformat()
        })
    
    async def broadcast_to_workflow(
        self, 
        workflow_id: str, 
        message: Dict, 
        exclude: WebSocket = None
    ):
        """Broadcast a message to all connections in a workflow"""
        
        if workflow_id not in self.workflow_connections:
            return
        
        connections = self.workflow_connections[workflow_id].copy()
        if exclude:
            connections.discard(exclude)
        
        if not connections:
            return
        
        message_str = json.dumps(message)
        disconnected = []
        
        for websocket in connections:
            try:
                await websocket.send_text(message_str)
            except Exception as e:
                logger.error(f"Failed to send message to WebSocket: {e}")
                disconnected.append(websocket)
        
        # Clean up disconnected websockets
        for websocket in disconnected:
            self.disconnect(websocket, workflow_id)
    
    async def send_execution_update(
        self, 
        workflow_id: str, 
        execution_id: str, 
        update: Dict
    ):
        """Send execution progress updates to workflow subscribers"""
        
        message = {
            "type": "execution_update",
            "execution_id": execution_id,
            "workflow_id": workflow_id,
            "update": update,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        await self.broadcast_to_workflow(workflow_id, message)
    
    def get_active_users(self, workflow_id: str) -> List[Dict[str, str]]:
        """Get list of active users in a workflow"""
        
        if workflow_id not in self.workflow_connections:
            return []
        
        active_users = []
        for websocket in self.workflow_connections[workflow_id]:
            if websocket in self.connection_info:
                user_info = self.connection_info[websocket]
                cursor_info = self.cursor_positions.get(workflow_id, {}).get(user_info["user_id"])
                
                active_users.append({
                    "user_id": user_info["user_id"],
                    "connected_at": user_info["connected_at"],
                    "cursor_position": cursor_info.get("position") if cursor_info else None,
                    "last_activity": cursor_info.get("timestamp") if cursor_info else user_info["connected_at"]
                })
        
        return active_users
















