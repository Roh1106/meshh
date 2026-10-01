import React from 'react';
import { Menu, Search, Bell, Download, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { APP_NAME, DEFAULT_CAMPUS } from '../../constants/app';
import { SyncIndicator } from '../common/SyncIndicator';
import { Avatar } from '../ui/Avatar';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { useAuth } from '../../context/AuthContext';

interface TopBarProps {
  onOpenMobileMenu: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenMobileMenu }) => {
  const navigate = useNavigate();
  const { currentUser, isAdmin, openLoginModal } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 pt-safe shadow-xs">
      <div className="h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between gap-3 max-w-7xl mx-auto w-full">
        {/* Left: Mobile Menu Trigger + Brand Info */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open navigation menu"
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => navigate('/home')}
            className="flex items-center gap-2.5 cursor-pointer min-w-0 group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-2xs group-hover:bg-blue-700 transition-colors">
              BV
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm text-gray-900 leading-tight tracking-tight group-hover:text-blue-600 transition-colors">
                {APP_NAME}
              </span>
              <span className="text-xs text-gray-500 font-medium truncate">
                {DEFAULT_CAMPUS.shortName} · {DEFAULT_CAMPUS.name}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Sync Status + Switch User + Notifications + PWA + Profile */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center">
            <SyncIndicator />
          </div>

          <button
            type="button"
            onClick={openLoginModal}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isAdmin
                ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 shadow-2xs'
                : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 shadow-2xs'
            }`}
            title="Switch between student and admin logins"
          >
            <UserCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate max-w-[130px] sm:max-w-none">
              {isAdmin ? `Admin: ${currentUser.name.split(' ')[0]}` : `Student: ${currentUser.name.split(' ')[0]}`}
            </span>
            <span className="hidden md:inline text-[10px] uppercase font-bold opacity-70 ml-0.5">
              (Switch)
            </span>
          </button>

          <div className="hidden lg:flex items-center">
            <PWAInstallButton compact />
          </div>

          <button
            type="button"
            onClick={() => navigate('/discover')}
            aria-label="Search catalog"
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/notifications')}
            aria-label="Notifications"
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-2 right-2 ring-2 ring-white" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/profile')}
            aria-label="Open profile"
            className="flex items-center gap-2 pl-1 pr-2 py-0.5 rounded-full hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
          >
            <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
            <span className="hidden xl:inline text-xs font-medium text-gray-700 truncate max-w-[100px]">
              {currentUser.name.split(' ')[0]}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
