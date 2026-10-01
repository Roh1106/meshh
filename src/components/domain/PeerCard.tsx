import React from 'react';
import { Star, Clock, Bookmark, BookmarkCheck, CheckCircle, ArrowRight, MessageSquare } from 'lucide-react';
import { Peer } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';

interface PeerCardProps {
  peer: Peer;
  onBookSession?: (peer: Peer) => void;
  onViewProfile?: (peer: Peer) => void;
  onProposeSwap?: (peer: Peer) => void;
  onToggleBookmark?: (peer: Peer) => void;
  isBookmarked?: boolean;
}

export const PeerCard: React.FC<PeerCardProps> = ({
  peer,
  onBookSession,
  onViewProfile,
  onProposeSwap,
  onToggleBookmark,
  isBookmarked = false,
}) => {
  const isSwapMatch = peer.wantsToLearn.some((w) =>
    w.toLowerCase().includes('python') || w.toLowerCase().includes('data science')
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-xs transition-shadow hover:shadow-sm">
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="relative shrink-0">
            <Avatar
              src={peer.avatar}
              name={peer.name}
              size="lg"
              badge={
                peer.roleTag?.includes('Rank') ? (
                  <span className="bg-amber-600 text-white rounded-full px-1 text-[10px] font-bold shadow-xs">
                    #{peer.roleTag.replace(/[^0-9]/g, '')}
                  </span>
                ) : peer.verified ? (
                  <span className="bg-emerald-600 text-white rounded-full p-0.5 flex items-center justify-center shadow-xs">
                    <CheckCircle className="w-3 h-3" />
                  </span>
                ) : undefined
              }
            />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                {peer.name}
              </h2>
              {peer.roleTag && (
                <Badge
                  size="sm"
                  variant={peer.roleTag.includes('Rank') ? 'amber' : 'blue'}
                  className="font-semibold"
                >
                  {peer.roleTag}
                </Badge>
              )}
            </div>

            <span className="text-xs text-gray-500 mt-0.5 truncate">
              {peer.year} · {peer.department}
            </span>

            <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
              <div className="flex items-center text-amber-600">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-0.5" />
                <span className="font-semibold text-gray-900">{peer.rating.toFixed(2)}</span>
              </div>
              <span className="text-gray-300">·</span>
              <span>{peer.sessionCount} peer sessions</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggleBookmark?.(peer)}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark peer'}
          className="text-gray-400 hover:text-blue-600 p-1 -mr-1 rounded-md transition-colors"
        >
          {isBookmarked ? (
            <BookmarkCheck className="w-5 h-5 text-blue-600 fill-blue-50" />
          ) : (
            <Bookmark className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* If this peer has distinct CAN TEACH / WANTS (like Neha Gupta in the mockup) */}
      {peer.canTeach && peer.wantsToLearn && peer.wantsToLearn.length > 0 ? (
        <div className="mt-3 grid grid-cols-1 gap-1.5 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2 min-w-0 text-xs">
            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold tracking-wider shrink-0">
              CAN TEACH
            </span>
            <span className="text-gray-800 truncate font-medium">
              {peer.canTeach.join(', ')}
            </span>
          </div>
          <div className="flex items-center gap-2 min-w-0 text-xs">
            <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold tracking-wider shrink-0">
              WANTS
            </span>
            <span className="text-gray-800 truncate font-medium">
              {peer.wantsToLearn.join(', ')}
            </span>
          </div>
        </div>
      ) : (
        /* Regular Skills Chips */
        <div className="flex flex-wrap gap-1.5 mt-3">
          {peer.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 rounded-md bg-gray-100 text-xs text-gray-700 font-medium"
            >
              {skill}
            </span>
          ))}
          {peer.skills.length > 3 && (
            <span className="px-2 py-0.5 rounded-md bg-gray-100 text-xs text-gray-500 font-medium">
              +{peer.skills.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Availability / Location Strip */}
      <div className="mt-3 bg-gray-50/80 px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs text-gray-700 border border-gray-100">
        <div className="flex items-center gap-1.5 min-w-0">
          <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">{peer.availability}</span>
        </div>
        <span className="text-gray-500 shrink-0 ml-1 text-[11px]">{peer.location}</span>
      </div>

      {/* Bottom Swap Bar or Action Buttons */}
      {isSwapMatch ? (
        <div className="mt-3 flex items-center justify-between pt-1 border-t border-gray-100">
          <span className="text-xs text-emerald-700 flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Matches your 'Python' listing
          </span>
          <button
            type="button"
            onClick={() => onProposeSwap?.(peer)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
          >
            <span>Propose Skill Swap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="mt-3.5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onViewProfile?.(peer)}
            className="w-full h-8 sm:h-9 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
            <span>View Profile</span>
          </button>
          <button
            type="button"
            onClick={() => onBookSession?.(peer)}
            className="w-full h-8 sm:h-9 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>Book Session</span>
          </button>
        </div>
      )}
    </div>
  );
};
