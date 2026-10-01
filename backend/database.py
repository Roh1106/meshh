"""
SkillMesh Local SQLite Database Driver
Provides indexed transactional storage for campus mesh node records.
"""

import sqlite3
import os
import json
from datetime import datetime

DB_FILE = os.path.join(os.path.dirname(__file__), "skillmesh.db")

def get_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # 1. Core Users & Profiles
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        department TEXT,
        year TEXT,
        role TEXT DEFAULT 'student',
        karma INTEGER DEFAULT 0,
        verified_skills_count INTEGER DEFAULT 0,
        created_at TEXT,
        updated_at TEXT,
        version INTEGER DEFAULT 1
    );
    """)

    # 2. Academic Resources & Study Materials
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS resources (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        subject TEXT NOT NULL,
        topic TEXT NOT NULL,
        format TEXT NOT NULL,
        file_size TEXT,
        semester TEXT,
        department TEXT,
        language TEXT DEFAULT 'English',
        verified INTEGER DEFAULT 0,
        verified_by TEXT,
        author TEXT,
        description TEXT,
        content_hash TEXT,
        created_at TEXT,
        version INTEGER DEFAULT 1
    );
    """)

    # 3. Synchronizable Events & Audit Log
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sync_events (
        event_id TEXT PRIMARY KEY,
        entity_type TEXT NOT NULL,
        record_id TEXT NOT NULL,
        operation TEXT NOT NULL,
        origin_device_id TEXT NOT NULL,
        version INTEGER NOT NULL,
        payload TEXT,
        timestamp TEXT NOT NULL
    );
    """)

    # 4. Known Peer Devices
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS peer_devices (
        device_id TEXT PRIMARY KEY,
        student_name TEXT,
        department TEXT,
        trust_level TEXT DEFAULT 'discovered',
        ip_address TEXT,
        protocol_version INTEGER DEFAULT 1,
        last_seen TEXT
    );
    """)

    # Indexes for rapid query retrieval
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_resources_dept ON resources(department);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_resources_subject ON resources(subject);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_sync_events_timestamp ON sync_events(timestamp);")

    # Seed initial data if empty
    cursor.execute("SELECT COUNT(*) as count FROM users")
    if cursor.fetchone()['count'] == 0:
        now = datetime.utcnow().isoformat()
        cursor.execute("""
        INSERT INTO users (id, name, email, department, year, role, karma, verified_skills_count, created_at, updated_at)
        VALUES ('usr_rohan', 'Rohan Ranmale', 'rohan.ranmale@bvu.edu.in', 'Computer Science & Eng.', '3rd Year', 'student', 480, 6, ?, ?);
        """, (now, now))

        cursor.execute("""
        INSERT INTO resources (id, title, subject, topic, format, file_size, semester, department, verified, author, description, created_at)
        VALUES ('res_dbms_cheat_sheet', 'Database Systems: Normalized ER Cheat Sheet', 'DBMS', 'Normalization', 'PDF', '1.8 MB', 'Semester 4', 'Computer Science & Eng.', 1, 'Aarav Sharma', 'Complete quick-reference for BCNF, 3NF, functional dependencies.', ?);
        """, (now,))

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("SkillMesh SQLite database initialized successfully at", DB_FILE)
