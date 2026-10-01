import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ToastProvider } from './context/ToastContext';
import { OfflineProvider } from './context/OfflineContext';
import { AuthProvider } from './context/AuthContext';

// Pages
import { DiscoverPage } from './pages/DiscoverPage';
import { HomePage } from './pages/HomePage';
import { CoursesPage } from './pages/CoursesPage';
import { AdminPage } from './pages/AdminPage';
import { SkillsPage } from './pages/SkillsPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ResourceDetailPage } from './pages/ResourceDetailPage';
import { QuestionsPage } from './pages/QuestionsPage';
import { QuestionDetailPage } from './pages/QuestionDetailPage';
import { SessionsPage } from './pages/SessionsPage';
import { SessionDetailPage } from './pages/SessionDetailPage';
import { TestsPage } from './pages/TestsPage';
import { TestRunnerPage } from './pages/TestRunnerPage';
import { HistoryPage } from './pages/HistoryPage';
import { SavedPage } from './pages/SavedPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProfileEditPage } from './pages/ProfileEditPage';
import { SettingsPage } from './pages/SettingsPage';
import { SyncCenterPage } from './pages/SyncCenterPage';
import { NotificationsPage } from './pages/NotificationsPage';

export default function App() {
  return (
    <ErrorBoundary>
      <OfflineProvider>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<AppShell />}>
                  <Route index element={<Navigate to="/home" replace />} />
                  <Route path="home" element={<HomePage />} />
                  <Route path="discover" element={<DiscoverPage />} />
                  <Route path="courses" element={<CoursesPage />} />
                  <Route path="admin" element={<AdminPage />} />
                  <Route path="skills" element={<SkillsPage />} />
                <Route path="resources" element={<ResourcesPage />} />
                <Route path="resources/:id" element={<ResourceDetailPage />} />
                <Route path="questions" element={<QuestionsPage />} />
                <Route path="questions/:id" element={<QuestionDetailPage />} />
                <Route path="sessions" element={<SessionsPage />} />
                <Route path="sessions/:id" element={<SessionDetailPage />} />
                <Route path="tests" element={<TestsPage />} />
                <Route path="tests/:id" element={<TestRunnerPage />} />
                <Route path="history" element={<HistoryPage />} />
                <Route path="saved" element={<SavedPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="profile/edit" element={<ProfileEditPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="sync" element={<SyncCenterPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/discover" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </OfflineProvider>
    </ErrorBoundary>
  );
}
