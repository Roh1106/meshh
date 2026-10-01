# Changelog

All notable changes to the SkillMesh peer learning platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-10-01

### Added
- **Application Shell & Navigation**:
  - Academic-themed AppShell with persistent desktop sidebar and mobile navigation bar (`MobileNav`).
  - Mobile slide-out drawer providing full access to all sections.
  - Persistent study room drawer peek: "Algorithms Peer Study Hall" with live room modal.
- **Discover Screen**:
  - Faithful pixel-level implementation matching the provided college prototype.
  - Campus mesh beacon status bar with offline simulation toggle.
  - Segmented scrollable tabs: All (18), Peers (8), Skills (6), Resources (4), Study Groups.
  - Micro-filter chips: Department, Year, Availability, Verified Mentors Only, In-Person / Nearby.
  - Filter feedback bar with dynamic count and "Reset all" action.
  - Aarav Sharma peer card (Tutor, 4.95 ★, 28 sessions, skills chips, booking modal).
  - Neha Gupta peer card (Dept Rank 3, CAN TEACH / WANTS matrix, swap proposal modal).
  - Siddharth M. skill exchange card (FastAPI Backend, seeking React UI, interested student avatars, connect modal).
  - Database Systems ER Cheat Sheet resource card (Prof. Rao Approved, PDF 1.8 MB, Save Offline).
- **Core Product Screens**:
  - `HomePage`: Academic greeting, mesh peer counter, quick search, continue learning, recommended peers.
  - `SkillsPage`: Structured Can Teach & Wants to Learn matrix, peer validation counts, add skill modal.
  - `ResourcesPage` & `ResourceDetailPage`: Courseware catalog, filters, PDF metadata, fullscreen simulated reader, offline storage.
  - `QuestionsPage` & `QuestionDetailPage`: Academic Q&A forum with question submission, useful votes, and peer answers with accepted solutions.
  - `SessionsPage` & `SessionDetailPage`: Mentoring sessions filtered by status (Scheduled, Requested, Completed, In progress).
  - `TestsPage` & `TestRunnerPage`: Interactive offline chapter assessments with instant answer evaluation and scoring.
  - `HistoryPage`: Date-grouped activity timeline (Today, Yesterday, This week, Older) with confirmation modal for history clearing.
  - `SavedPage`: Bookmark manager for resources, peers, questions, and sessions.
  - `ProfilePage` & `ProfileEditPage`: Compact academic student profile with Karma, badges, availability, and privacy controls.
  - `SettingsPage`: College campus selector, IndexedDB storage allocation display, cache clearing.
  - `SyncCenterPage`: Mesh connection status, discoverable peer count, pending sync queue, and manual sync trigger.
  - `NotificationsPage`: Session alerts and skill swap match broadcasts.
- **Offline & PWA Infrastructure**:
  - `VitePWA` setup with Service Worker auto-update and precaching.
  - Web App Manifest configured for standalone display, icons (192px, 512px, maskable), theme colors.
  - `usePWAInstall` hook and in-app install buttons with iOS Safari guide dialog.
  - `OfflineContext` tracking real online/offline events plus simulated mesh offline mode.
- **Design System & Error Handling**:
  - Complete suite of reusable primitives: `Button`, `IconButton`, `Input`, `Textarea`, `Select`, `Badge`, `StatusBadge`, `Avatar`, `AvatarGroup`, `Card`, `Tabs`, `Skeleton`, `Spinner`, `EmptyState`, `ErrorState`, `SearchBar`, `PageHeader`.
  - Centralized popup system: `ToastProvider`, `Modal`, `ConfirmDialog`, `Drawer`, `BottomSheet`.
  - React `ErrorBoundary` and normalized `AppError` logging.
