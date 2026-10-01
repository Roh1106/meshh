"""
SkillMesh P2P Sync & Resource Models
"""

from typing import Optional, List, Dict, Any

class HandshakeRequest:
    def __init__(self, device_id: str, protocol_version: int, records_state: Optional[Dict[str, int]] = None):
        self.device_id = device_id
        self.protocol_version = protocol_version
        self.records_state = records_state or {}

class HandshakeResponse:
    def __init__(self, device_id: str, status: str, protocol_version: int = 1, missing_events_count: int = 0):
        self.device_id = device_id
        self.status = status
        self.protocol_version = protocol_version
        self.missing_events_count = missing_events_count

    def to_dict(self) -> Dict[str, Any]:
        return {
            "device_id": self.device_id,
            "status": self.status,
            "protocol_version": self.protocol_version,
            "missing_events_count": self.missing_events_count,
        }
