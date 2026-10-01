import React from 'react';
import { RefreshCw, Users, Handshake } from 'lucide-react';
import { SkillSwapListing } from '../../types';
import { AvatarGroup } from '../ui/AvatarGroup';

export const SkillSwapCard: React.FC<{
  listing: SkillSwapListing;
  onConnect?: (listing: SkillSwapListing) => void;
}> = ({ listing, onConnect }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-xs transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold ring-1 ring-blue-200">
            {listing.authorName.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-semibold text-gray-900">
              {listing.authorName} ({listing.authorMeta.split('·')[0].trim()})
            </span>
            <span className="text-[11px] text-gray-500">
              {listing.authorMeta.includes('·') ? listing.authorMeta.split('·')[1].trim() : ''} ·{' '}
              {listing.location}
            </span>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
          {listing.tag || `${listing.interestedCount} Interested`}
        </span>
      </div>

      <div className="mt-2.5">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-snug">
          {listing.title}
        </h3>
        <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
          {listing.description}
        </p>
      </div>

      <div className="mt-2.5 flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100 text-xs">
        <RefreshCw className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        <span className="text-gray-700 truncate">
          Seeking: <strong className="font-semibold text-blue-600">{listing.seekingSkill}</strong>
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between pt-1">
        <AvatarGroup initials={listing.interestedAvatars} max={3} size="sm" />
        <button
          type="button"
          onClick={() => onConnect?.(listing)}
          className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-semibold transition-colors flex items-center gap-1.5"
        >
          <Handshake className="w-3.5 h-3.5 text-gray-600" />
          <span>Connect & Collaborate</span>
        </button>
      </div>
    </div>
  );
};
