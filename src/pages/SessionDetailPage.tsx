import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { sessionService } from '../services/sessionService';
import { MentoringSession } from '../types';
import { Spinner } from '../components/ui/Spinner';
import { ErrorState } from '../components/ui/ErrorState';
import { Avatar } from '../components/ui/Avatar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Calendar, Clock, MapPin, Star, User, ShieldCheck, CheckCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const SessionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess } = useToast();

  const [session, setSession] = useState<MentoringSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const item = await sessionService.getSessionById(id);
        if (mounted && item) setSession(item);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (isLoading) return <Spinner size="lg" className="py-20" />;

  if (!session) {
    return (
      <div className="py-10">
        <ErrorState
          title="Session Record Not Found"
          message="This session record may have been concluded or cancelled."
          onRetry={() => navigate('/sessions')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader title={session.topic} backTo="/sessions" />

      <div className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Avatar src={session.mentorAvatar} name={session.mentorName} size="md" />
            <div>
              <p className="text-xs sm:text-sm font-semibold text-gray-900">{session.mentorName}</p>
              <p className="text-[11px] text-gray-500">Peer Mentor & Study Partner</p>
            </div>
          </div>
          <StatusBadge status={session.status} />
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Topic & Objective
          </h3>
          <p className="text-xs sm:text-sm font-medium text-gray-900">{session.topic}</p>
          {session.notes && (
            <p className="text-xs text-gray-600 mt-1 italic bg-gray-50 p-2.5 rounded-lg border border-gray-100">
              "{session.notes}"
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 border border-gray-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
            <div>
              <span className="text-[10px] text-gray-400 block">Date</span>
              <span className="font-semibold text-gray-800">{session.date}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400 shrink-0" />
            <div>
              <span className="text-[10px] text-gray-400 block">Time & Duration</span>
              <span className="font-semibold text-gray-800">{session.time} ({session.duration})</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <div>
              <span className="text-[10px] text-gray-400 block">Location</span>
              <span className="font-semibold text-gray-800">{session.location}</span>
            </div>
          </div>
        </div>

        {session.rating && (
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100 text-xs text-gray-600">
            <span className="font-semibold text-gray-900">Session Rating:</span>
            <div className="flex items-center text-amber-500">
              <Star className="w-4 h-4 fill-amber-500 mr-1" />
              <span className="font-bold text-gray-900">{session.rating.toFixed(1)} / 5.0</span>
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Participant: <strong>{session.menteeName}</strong>
          </span>
          {session.status === 'Scheduled' && (
            <button
              onClick={() => showSuccess('Check-in confirmed with your peer mentor!')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-2xs"
            >
              Verify Campus Check-in
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
