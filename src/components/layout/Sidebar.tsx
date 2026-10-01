import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Compass,
  BookOpen,
  Folder,
  HelpCircle,
  Users,
  GraduationCap,
  History,
  Bookmark,
  User,
  Settings,
  RefreshCw,
  Sparkles,
  Wifi,
  WifiOff,
  ChevronDown,
  Layers,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { APP_NAME, APP_VERSION, DEFAULT_CAMPUS } from '../../constants/app';
import { useOffline } from '../../context/OfflineContext';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';

export const Sidebar: React.FC = () => {
  const { effectiveOffline, toggleSimulatedOffline, lastSyncedText, isSyncing } = useOffline();
  const { currentUser, isAdmin, openLoginModal } = useAuth();

  const academicNav = [
    { to: '/home', label: 'Home Dashboard', icon: GraduationCap },
    { to: '/courses', label: 'Courses & Syllabus', icon: BookOpen },
    { to: '/tests', label: 'Test Series & Exams', icon: AwardIcon },
    { to: '/resources', label: 'Academic Resources', icon: Folder },
  ];

  const peerNav = [
    { to: '/discover', label: 'Discover Peers', icon: Compass },
    { to: '/skills', label: 'Skill Exchange', icon: Layers },
    { to: '/questions', label: 'Q&A Forum', icon: HelpCircle },
    { to: '/sessions', label: 'Study Sessions', icon: Users },
  ];

  const personalNav = [
    { to: '/saved', label: 'Saved Library', icon: Bookmark },
    { to: '/history', label: 'Activity Log', icon: History },
  ];

  const systemNav = [
    { to: '/admin', label: 'Faculty Admin', icon: ShieldCheck, highlight: true },
    { to: '/sync', label: 'Sync Center', icon: RefreshCw },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Brand & Campus Selector */}
      <div className="p-4 border-b border-gray-100 shrink-0">
        <NavLink to="/home" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs group-hover:bg-blue-700 transition-colors">
            BV
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm text-gray-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">
              {APP_NAME}
            </span>
            <span className="text-xs text-gray-500 font-medium truncate mt-1">
              {DEFAULT_CAMPUS.shortName} · Campus
            </span>
          </div>
        </NavLink>
      </div>

      {/* Navigation Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {/* Academics Section */}
        <div className="space-y-1">
          <span className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Academics
          </span>
          {academicNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Campus Network */}
        <div className="border-t border-gray-100 pt-3 space-y-1">
          <span className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Campus Network
          </span>
          {peerNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Library & Records */}
        <div className="border-t border-gray-100 pt-3 space-y-1">
          <span className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Library
          </span>
          {personalNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* System & Admin */}
        <div className="border-t border-gray-100 pt-3 space-y-1">
          <span className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            System & Management
          </span>
          {systemNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                      : item.highlight && isAdmin
                      ? 'text-purple-700 hover:bg-purple-50 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.highlight && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      isAdmin
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {isAdmin ? 'Active' : 'Admin'}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Sidebar Footer: User mini-profile, Mesh status, Version */}
      <div className="p-3 border-t border-gray-100 bg-gray-50/50 shrink-0 space-y-2">
        <div className="flex items-center justify-between">
          <NavLink
            to="/profile"
            className="flex items-center gap-2 min-w-0 flex-1 p-1 rounded-lg hover:bg-white transition-colors"
          >
            <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-gray-900 truncate">
                  {currentUser.name}
                </span>
                {isAdmin && (
                  <span className="px-1 py-0.1 bg-purple-100 text-purple-800 text-[9px] font-bold rounded">
                    ADMIN
                  </span>
                )}
              </div>
              <span className="text-[11px] text-gray-500 truncate">
                {currentUser.rollNo || currentUser.designation || currentUser.department}
              </span>
            </div>
          </NavLink>

          <button
            onClick={openLoginModal}
            title="Switch User / Admin Login"
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-white transition-colors shrink-0"
          >
            <UserCheck className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between px-1.5 pt-1 text-[11px] text-gray-500 border-t border-gray-200/50">
          <button
            onClick={toggleSimulatedOffline}
            className="flex items-center gap-1.5 hover:text-gray-900 transition-colors cursor-pointer"
            title="Toggle offline simulated mode"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                effectiveOffline ? 'bg-gray-400' : 'bg-emerald-500'
              }`}
            />
            <span>{effectiveOffline ? 'Offline Mode' : 'Mesh Online'}</span>
          </button>
          <span className="text-gray-400 font-mono">v{APP_VERSION}</span>
        </div>
      </div>
    </aside>
  );
};

const AwardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="8" r="6" strokeWidth="2" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);

