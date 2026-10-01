import React from 'react';
import { Calendar, Clock, MapPin, Star, User } from 'lucide-react';
import { MentoringSession } from '../../types';
import { Avatar } from '../ui/Avatar';
import { StatusBadge } from '../ui/StatusBadge';

interface SessionCardProps {
  session: MentoringSession;
  onViewDetails?: (session: MentoringSession) => void;
  onJoinMeeting?: (session: MentoringSession) => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onViewDetails,
  onJoinMeeting,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-xs transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Avatar src={session.mentorAvatar} name={session.mentorName} size="sm" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-900">{session.mentorName}</span>
            <span className="text-[11px] text-gray-500">Peer Mentor</span>
          </div>
        </div>
        <StatusBadge status={session.status} />
      </div>

      <div className="mt-2.5">
        <h3
          onClick={() => onViewDetails?.(session)}
          className="text-sm sm:text-base font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors leading-snug"
        >
          {session.topic}
        </h3>
        {session.notes && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-1 italic">
            "{session.notes}"
          </p>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
        <div className="flex items-center gap-1.5 truncate">
          <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="truncate">{session.date}</span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="truncate">{session.time} ({session.duration})</span>
        </div>
        <div className="col-span-2 flex items-center gap-1.5 text-gray-500 truncate">
          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="truncate">{session.location}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between pt-1">
        {session.rating ? (
          <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{session.rating.toFixed(1)} / 5.0</span>
            <span className="text-gray-400 font-normal ml-1">· Completed</span>
          </div>
        ) : (
          <span className="text-[11px] text-gray-400">Offline peer meetup</span>
        )}

        <div className="flex items-center gap-2">
          {session.status === 'Scheduled' && (
            <button
              onClick={() => onJoinMeeting?.(session)}
              className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-2xs"
            >
              Check In
            </button>
          )}
          <button
            onClick={() => onViewDetails?.(session)}
            className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-md transition-colors"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};
