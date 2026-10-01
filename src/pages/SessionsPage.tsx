import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { SessionCard } from '../components/domain/SessionCard';
import { sessionService } from '../services/sessionService';
import { MentoringSession, SessionStatus } from '../types';
import { EmptyState } from '../components/ui/EmptyState';
import { CardSkeleton } from '../components/ui/Skeleton';
import { Calendar, Plus, Users } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const SessionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess } = useToast();

  const [sessions, setSessions] = useState<MentoringSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<SessionStatus | 'All'>('All');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await sessionService.getSessions(selectedStatus);
        if (mounted) setSessions(data);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [selectedStatus]);

  const statusFilters: (SessionStatus | 'All')[] = [
    'All',
    'Scheduled',
    'Requested',
    'Completed',
    'In progress',
  ];

  return (
    <div className="space-y-4 pb-12">
      <PageHeader
        title="Mentoring & Study Sessions"
        description="Schedule 1-on-1 peer walkthroughs, record local meetups, and exchange academic guidance."
        action={
          <button
            onClick={() => navigate('/discover')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Find Mentor</span>
          </button>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
        {statusFilters.map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedStatus === st
                ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 pt-2">
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : sessions.length === 0 ? (
          <EmptyState
            title="No mentoring sessions in this category"
            description="You have no sessions matching this status filter."
            actionLabel="Discover Mentors"
            onAction={() => navigate('/discover')}
          />
        ) : (
          sessions.map((sess) => (
            <SessionCard
              key={sess.id}
              session={sess}
              onViewDetails={() => navigate(`/sessions/${sess.id}`)}
              onJoinMeeting={() => showSuccess(`Checked in for session with ${sess.mentorName} at ${sess.location}.`)}
            />
          ))
        )}
      </div>
    </div>
  );
};
