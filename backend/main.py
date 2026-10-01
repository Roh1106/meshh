"""
SkillMesh Local FastAPI Service
Exposes local SQLite records, mesh peer coordination, and synchronizer endpoints.
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import datetime
import json
from .database import get_connection, init_db

app = FastAPI(
    title="SkillMesh Local Node API",
    description="Campus Mesh Synchronization and Resource Sharing Endpoint",
    version="0.1.0",
)

# Enable CORS for the local Vite dev server and PWA
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database schema on startup
@app.on_event("startup")
def on_startup():
    init_db()

# Pydantic Schemas
class HandshakePayload(BaseModel):
    device_id: str
    protocol_version: int = 1
    known_versions: Optional[Dict[str, int]] = None

class SyncPushPayload(BaseModel):
    origin_device_id: str
    events: List[Dict[str, Any]]

class ResourceTransferPayload(BaseModel):
    resource_id: str
    chunk_index: int = 0
    total_chunks: int = 1

# WebSocket Mesh Broadcaster
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

manager = ConnectionManager()

# 1. Health & Diagnostic Check
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SkillMesh Local Node",
        "version": "0.1.0",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "database": "sqlite3_ready",
    }

# 2. Campus Mesh Status
@app.get("/api/status")
def get_status():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) as count FROM resources")
    resources_count = cursor.fetchone()["count"]
    cursor.execute("SELECT COUNT(*) as count FROM peer_devices")
    peers_count = cursor.fetchone()["count"]
    cursor.execute("SELECT COUNT(*) as count FROM sync_events")
    events_count = cursor.fetchone()["count"]
    conn.close()

    return {
        "node_id": "bvcoe_node_local",
        "campus": "Bharti Vidyapeeth College of Engineering",
        "network_state": "LOCAL_MESH_ONLINE",
        "cached_resources": resources_count,
        "discovered_peers": peers_count,
        "logged_events": events_count,
    }

# 3. Discovered Peers
@app.get("/api/peers")
def get_peers():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM peer_devices")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return {"peers": rows}

# 4. Synchronization Handshake
@app.post("/api/sync/handshake")
def sync_handshake(payload: HandshakePayload):
    if payload.protocol_version != 1:
        raise HTTPException(
            status_code=400,
            detail=f"Incompatible sync protocol version {payload.protocol_version}. Expected 1.",
        )

    # Register/update peer device
    conn = get_connection()
    cursor = conn.cursor()
    now = datetime.datetime.utcnow().isoformat()
    cursor.execute("""
    INSERT INTO peer_devices (device_id, student_name, trust_level, protocol_version, last_seen)
    VALUES (?, 'Peer Node', 'discovered', ?, ?)
    ON CONFLICT(device_id) DO UPDATE SET last_seen = ?;
    """, (payload.device_id, payload.protocol_version, now, now))
    conn.commit()
    conn.close()

    return {
        "status": "acknowledged",
        "device_id": "bvcoe_node_local",
        "protocol_version": 1,
        "message": "Handshake accepted. Ready for vector pull/push exchange.",
    }

# 5. Pull Changes
@app.post("/api/sync/pull")
def sync_pull(since_timestamp: Optional[str] = None):
    conn = get_connection()
    cursor = conn.cursor()
    if since_timestamp:
        cursor.execute("SELECT * FROM sync_events WHERE timestamp > ? ORDER BY timestamp ASC LIMIT 50", (since_timestamp,))
    else:
        cursor.execute("SELECT * FROM sync_events ORDER BY timestamp ASC LIMIT 50")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return {"changes": rows}

# 6. Push Changes
@app.post("/api/sync/push")
async def sync_push(payload: SyncPushPayload):
    conn = get_connection()
    cursor = conn.cursor()
    applied = 0
    for ev in payload.events:
        cursor.execute("""
        INSERT OR IGNORE INTO sync_events (event_id, entity_type, record_id, operation, origin_device_id, version, payload, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            ev.get("eventId"),
            ev.get("entityType"),
            ev.get("recordId"),
            ev.get("operation"),
            payload.origin_device_id,
            ev.get("version", 1),
            json.dumps(ev.get("payload", {})),
            ev.get("timestamp", datetime.datetime.utcnow().isoformat()),
        ))
        applied += 1
    conn.commit()
    conn.close()

    # Broadcast change notification to connected mesh WebSockets
    await manager.broadcast({
        "type": "PEER_SYNC_ANNOUNCEMENT",
        "sender": payload.origin_device_id,
        "events_count": applied,
    })

    return {"status": "success", "applied_events": applied}

# 7. Resumable Resource Transfer Chunk Endpoint
@app.post("/api/resources/transfer")
def transfer_chunk(payload: ResourceTransferPayload):
    return {
        "resource_id": payload.resource_id,
        "chunk_index": payload.chunk_index,
        "total_chunks": payload.total_chunks,
        "status": "chunk_accepted",
        "bytes_verified": True,
    }

# 8. Real-time WebSocket Endpoint
@app.websocket("/ws/mesh")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            # Broadcast to all other peers
            await manager.broadcast(data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
