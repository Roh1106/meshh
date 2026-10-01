import React from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Bell, Users, MessageSquare, CheckCircle, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();

  const notifications = [
    {
      id: 'n1',
      title: 'Session Scheduled with Aarav Sharma',
      description: 'Your mentoring session for Relational Normalization has been confirmed for Today at 4:30 PM.',
      time: '15 mins ago',
      type: 'session',
      link: '/sessions',
      unread: true,
    },
    {
      id: 'n2',
      title: 'Skill Swap Match Nearby',
      description: 'Neha Gupta is available at Tech Park Cafe and is seeking Python tutoring in exchange for Verilog DSP.',
      time: '2 hours ago',
      type: 'swap',
      link: '/discover',
      unread: true,
    },
    {
      id: 'n3',
      title: 'Verified Resource Added',
      description: 'Prof. Rao has approved the new Normalized ER Cheat Sheet for CSE Semester 4 students.',
      time: 'Yesterday',
      type: 'resource',
      link: '/resources/res_dbms_cheat_sheet',
      unread: false,
    },
  ];

  return (
    <div className="space-y-4 pb-12 max-w-2xl mx-auto">
      <PageHeader
        title="Notifications"
        description="Campus mesh broadcasts, session alerts, and peer study invitations."
      />

      <div className="bg-white rounded-xl border border-gray-200/90 divide-y divide-gray-100 shadow-xs">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => navigate(n.link)}
            className={`p-4 flex items-start gap-3 cursor-pointer hover:bg-gray-50/80 transition-colors ${
              n.unread ? 'bg-blue-50/20' : ''
            }`}
          >
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0 mt-0.5">
              {n.type === 'session' ? (
                <Calendar className="w-4 h-4" />
              ) : n.type === 'swap' ? (
                <Users className="w-4 h-4 text-emerald-600" />
              ) : (
                <CheckCircle className="w-4 h-4 text-purple-600" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-semibold text-gray-900 leading-snug">
                  {n.title}
                </h4>
                <span className="text-[11px] text-gray-400 shrink-0 ml-2">{n.time}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1 leading-normal">{n.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
