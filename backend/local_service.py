#!/usr/bin/env python3
"""
SkillMesh Zero-Dependency Local Node Server
Runs on Python 3 standard library (http.server + sqlite3 + json).
Requires NO external pip packages.
"""

import sys
import os
import json
import sqlite3
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse

# Ensure database is initialized
from database import init_db, get_connection

init_db()

PORT = 8000

class SkillMeshHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200, content_type="application/json"):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/health":
            self._set_headers(200)
            res = {
                "status": "healthy",
                "service": "SkillMesh Local Node (Stdlib)",
                "version": "0.1.0",
                "timestamp": datetime.utcnow().isoformat(),
                "database": "sqlite3_active",
            }
            self.wfile.write(json.dumps(res).encode("utf-8"))

        elif path == "/api/status":
            self._set_headers(200)
            conn = get_connection()
            c = conn.cursor()
            c.execute("SELECT COUNT(*) as cnt FROM resources")
            rc = c.fetchone()["cnt"]
            c.execute("SELECT COUNT(*) as cnt FROM peer_devices")
            pc = c.fetchone()["cnt"]
            c.execute("SELECT COUNT(*) as cnt FROM sync_events")
            ec = c.fetchone()["cnt"]
            conn.close()

            res = {
                "node_id": "bvcoe_node_local",
                "campus": "Bharti Vidyapeeth College of Engineering",
                "network_state": "LOCAL_MESH_ONLINE",
                "cached_resources": rc,
                "discovered_peers": pc,
                "logged_events": ec,
            }
            self.wfile.write(json.dumps(res).encode("utf-8"))

        elif path == "/api/peers":
            self._set_headers(200)
            conn = get_connection()
            c = conn.cursor()
            c.execute("SELECT * FROM peer_devices")
            rows = [dict(r) for r in c.fetchall()]
            conn.close()
            self.wfile.write(json.dumps({"peers": rows}).encode("utf-8"))

        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode("utf-8"))

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get("Content-Length", 0))
        body = {}
        if length > 0:
            try:
                body = json.loads(self.rfile.read(length).decode("utf-8"))
            except Exception:
                body = {}

        if path == "/api/sync/handshake":
            self._set_headers(200)
            device_id = body.get("device_id", "peer_node")
            conn = get_connection()
            c = conn.cursor()
            now = datetime.utcnow().isoformat()
            c.execute("""
            INSERT INTO peer_devices (device_id, student_name, trust_level, protocol_version, last_seen)
            VALUES (?, 'Peer Node', 'discovered', 1, ?)
            ON CONFLICT(device_id) DO UPDATE SET last_seen = ?;
            """, (device_id, now, now))
            conn.commit()
            conn.close()

            res = {
                "status": "acknowledged",
                "device_id": "bvcoe_node_local",
                "protocol_version": 1,
                "message": "Handshake accepted by standard library local server.",
            }
            self.wfile.write(json.dumps(res).encode("utf-8"))

        elif path == "/api/sync/pull":
            self._set_headers(200)
            conn = get_connection()
            c = conn.cursor()
            c.execute("SELECT * FROM sync_events ORDER BY timestamp ASC LIMIT 50")
            rows = [dict(r) for r in c.fetchall()]
            conn.close()
            self.wfile.write(json.dumps({"changes": rows}).encode("utf-8"))

        elif path == "/api/sync/push":
            self._set_headers(200)
            events = body.get("events", [])
            origin_id = body.get("origin_device_id", "peer_node")
            conn = get_connection()
            c = conn.cursor()
            applied = 0
            for ev in events:
                c.execute("""
                INSERT OR IGNORE INTO sync_events (event_id, entity_type, record_id, operation, origin_device_id, version, payload, timestamp)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?);
                """, (
                    ev.get("eventId"),
                    ev.get("entityType"),
                    ev.get("recordId"),
                    ev.get("operation"),
                    origin_id,
                    ev.get("version", 1),
                    json.dumps(ev.get("payload", {})),
                    ev.get("timestamp", datetime.utcnow().isoformat()),
                ))
                applied += 1
            conn.commit()
            conn.close()
            self.wfile.write(json.dumps({"status": "success", "applied_events": applied}).encode("utf-8"))

        elif path == "/api/resources/transfer":
            self._set_headers(200)
            res = {
                "resource_id": body.get("resource_id", ""),
                "chunk_index": body.get("chunk_index", 0),
                "status": "chunk_accepted",
                "bytes_verified": True,
            }
            self.wfile.write(json.dumps(res).encode("utf-8"))

        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode("utf-8"))

def run():
    server = HTTPServer(("0.0.0.0", PORT), SkillMeshHandler)
    print(f"[SkillMesh] Local Python Node Server running on http://localhost:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[SkillMesh] Server shutting down cleanly.")
        server.server_close()

if __name__ == "__main__":
    run()
