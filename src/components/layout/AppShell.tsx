import React, { useState } from 'react';
import { Outlet, useLocation, NavLink } from 'react-router-dom';
import {
  GraduationCap,
  Compass,
  Layers,
  Folder,
  HelpCircle,
  Users,
  BookOpen,
  History,
  Bookmark,
  User,
  Settings,
  RefreshCw,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { Drawer } from '../common/Drawer';
import { StudyHallBanner } from '../domain/StudyHallBanner';
import { LoginModal } from '../common/LoginModal';
import { APP_NAME, DEFAULT_CAMPUS, APP_VERSION } from '../../constants/app';
import { Avatar } from '../ui/Avatar';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { useOffline } from '../../context/OfflineContext';
import { useAuth } from '../../context/AuthContext';

export const AppShell: React.FC = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const location = useLocation();
  const { effectiveOffline, toggleSimulatedOffline } = useOffline();
  const { currentUser, isAdmin, openLoginModal } = useAuth();

  const closeDrawer = () => setMobileDrawerOpen(false);

  const drawerLinks = [
    { to: '/home', label: 'Home', icon: GraduationCap },
    { to: '/discover', label: 'Discover', icon: Compass },
    { to: '/courses', label: 'Courses & Registration', icon: BookOpen },
    { to: '/skills', label: 'Skills Matrix', icon: Layers },
    { to: '/resources', label: 'Academic Resources', icon: Folder },
    { to: '/questions', label: 'Academic Q&A', icon: HelpCircle },
    { to: '/sessions', label: 'Mentoring Sessions', icon: Users },
    { to: '/tests', label: 'Tests & Higher Exams', icon: BookOpen },
    { to: '/history', label: 'Activity History', icon: History },
    { to: '/saved', label: 'Saved Items', icon: Bookmark },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings },
    { to: '/sync', label: 'Sync Center', icon: RefreshCw },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin Console', icon: ShieldCheck }] : []),
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col md:flex-row antialiased">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <TopBar onOpenMobileMenu={() => setMobileDrawerOpen(true)} />

        <main className="flex-1 pb-24 md:pb-12 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        {/* Mobile Persistent Bottom Navigation */}
        <MobileNav />

        {/* Persistent Study Hall Peek Banner */}
        <StudyHallBanner />
      </div>

      {/* Global Login & Account Switcher Modal */}
      <LoginModal />

      {/* Mobile Menu Drawer */}
      <Drawer
        isOpen={mobileDrawerOpen}
        onClose={closeDrawer}
        title={`${APP_NAME} Menu`}
        side="left"
      >
        <div className="flex flex-col h-full space-y-4">
          {/* User mini banner with Switch User trigger */}
          <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar src={currentUser.avatar} name={currentUser.name} size="md" />
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-xs text-gray-900 truncate">
                    {currentUser.name}
                  </span>
                  {isAdmin && (
                    <span className="px-1 py-0.2 bg-purple-100 text-purple-800 text-[9px] font-bold rounded">
                      ADMIN
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-gray-500 truncate">
                  {currentUser.rollNo || currentUser.designation} · {DEFAULT_CAMPUS.shortName}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                closeDrawer();
                openLoginModal();
              }}
              title="Switch Account"
              className="p-1 text-blue-600 hover:bg-blue-50 rounded text-xs font-semibold shrink-0"
            >
              Switch
            </button>
          </div>

          <div className="flex items-center justify-between px-1">
            <PWAInstallButton compact />
            <button
              onClick={toggleSimulatedOffline}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              {effectiveOffline ? 'Go Online' : 'Go Offline'}
            </button>
          </div>

          {/* Links List */}
          <div className="flex-1 overflow-y-auto space-y-1 py-1">
            {drawerLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeDrawer}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-400 flex items-center justify-between">
            <span>{DEFAULT_CAMPUS.shortName} Campus Node</span>
            <span>v{APP_VERSION}</span>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
