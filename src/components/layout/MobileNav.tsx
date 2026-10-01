import React from 'react';
import { NavLink } from 'react-router-dom';
import { GraduationCap, Compass, Folder, Users, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const items = [
    { to: '/home', label: 'Home', icon: GraduationCap },
    { to: '/discover', label: 'Discover', icon: Compass },
    { to: '/resources', label: 'Resources', icon: Folder },
    { to: '/sessions', label: 'Sessions', icon: Users },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 pb-safe shadow-[0_-1px_6px_rgba(0,0,0,0.03)]"
    >
      <div className="flex items-center justify-around h-14 px-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-w-[56px] h-11 gap-0.5 transition-colors select-none ${
                  isActive
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-500 hover:text-gray-900 font-medium'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-[10px] leading-tight">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
