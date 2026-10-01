# SkillMesh Architecture Document

## Overview
SkillMesh is a lightweight, offline-first peer learning and academic skill-exchange web application designed specifically for college campuses. It enables university students to discover peers with complementary skills, trade knowledge without financial friction, review faculty-approved courseware, ask curriculum doubts, and prepare for exams even in zero or low-connectivity environments.

---

## 1. System Layers & Boundaries

```
┌─────────────────────────────────────────────────────────────┐
│                       SkillMesh UI                          │
│   (React 19 + Tailwind v4 + Lucide + PWA Responsive Shell)  │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    Application Contexts                     │
│    • OfflineContext: Real + Simulated Mesh connectivity     │
│    • ToastContext: Centralized status & error toasts        │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                  Decoupled Service Layer                    │
│    • peerService        • resourceService                   │
│    • questionService    • sessionService                    │
│    • testService        • historyService                    │
│    • savedService       • errorHandler                      │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│            Local Storage & Offline Foundations              │
│    • VitePWA Service Worker & App Shell Precaching          │
│    • IndexedDB / Local Storage for files & notes            │
│    • (Planned Backend: Python FastAPI + SQLite + WebSocket) │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Core Modules

### 2.1 App Shell & Navigation
- **Desktop**: A persistent 64-column sidebar with academic branding, campus switcher (`Apex Eng. College`), primary curriculum navigation, personal bookmarks/history, system settings, and user mini-profile with online/offline badge and app version (`v0.1.0`).
- **Mobile**: A compact top bar with safe-area spacing, touch-friendly bottom navigation bar (`Home`, `Discover`, `Resources`, `Sessions`, `Profile`), and a slide-out drawer containing secondary modules (`Tests`, `Questions`, `History`, `Settings`, `Sync Center`).
- **Study Hall Peek**: A floating persistent room banner (`Algorithms Peer Study Hall - Lab 402`) allowing students to view and check into active physical study circles on campus.

### 2.2 Offline-First Architecture
- **Connectivity Detection**: `OfflineContext` listens to native `online`/`offline` browser events.
- **Simulated Campus Mesh Toggle**: Allows students and evaluators to switch into "Offline Mode" directly from the Discover feed or Sync Center to verify that saved courseware, practice quizzes, and cached peer profiles remain usable without active internet.
- **Optimistic Reconciliation Queue**: Pending requests (booking mentoring sessions, proposing swaps, uploading notes) increment a local queue counter displayed in the Sync Center.

### 2.3 Centralized Popup & Toast System
- `ToastProvider`: Provides `showSuccess`, `showError`, `showWarning`, and `showInfo` methods with accessible keyboard dismiss actions.
- `Modal` & `ConfirmDialog`: Follow strict WCAG guidelines with `Escape` key listeners, focus management, backdrop dismiss, and non-blocking layout.
- `Drawer` & `BottomSheet`: Mobile-optimized sliding sheets for filters and menus.

### 2.4 Reusable UI Components
- Primitives in `src/components/ui/` adhere to the academic color palette (`#2563EB` primary, `#F7F7F5` background, `#1F2937` primary text, `#15803D` success, `#B45309` warning, `#B91C1C` error).
- Zero reliance on flashy gradients, glowing cards, or AI-showcase gimmicks.
- Every async operation handles `Loading`, `Empty`, `Error`, `Offline`, and `Success` states gracefully.

---

## 3. Technology Direction & Dependencies
- **Frontend**: React 19, Vite, TypeScript, React Router 7, Tailwind CSS v4, Lucide React, `vite-plugin-pwa`.
- **PWA**: Web App Manifest (`manifest.json`), service worker precaching, and in-app install prompt with Safari iOS guidance.
- **Local Backend (Roadmap)**: FastAPI Python server with SQLite database and WebSocket endpoints for local multicast discovery.
