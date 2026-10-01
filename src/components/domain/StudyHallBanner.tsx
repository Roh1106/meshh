import React, { useState } from 'react';
import { Users2, Radio, X, MapPin, MessageSquare } from 'lucide-react';
import { Modal } from '../common/Modal';

export const StudyHallBanner: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <>
      <div className="fixed bottom-16 sm:bottom-6 left-0 right-0 max-w-xl mx-auto px-4 pointer-events-none z-30">
        <div className="pointer-events-auto bg-[#1F2937] text-white rounded-xl p-3 shadow-lg flex items-center justify-between border border-gray-700/60 transition-transform">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
              <Users2 className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-sm font-semibold text-white truncate">
                Algorithms Peer Study Hall
              </span>
              <span className="text-[11px] text-gray-300 truncate">
                Lab 402 · 6 peers active right now
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1 bg-white text-gray-900 text-xs font-semibold rounded-md hover:bg-gray-100 transition-colors shadow-2xs"
            >
              {isJoined ? 'View Room' : 'Join Room'}
            </button>
            <button
              onClick={() => setDismissed(true)}
              aria-label="Dismiss study hall notification"
              className="text-gray-400 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Algorithms Peer Study Hall"
        description="Physical Campus Session · Lab 402, CS Block"
      >
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="p-3 bg-blue-50/70 border border-blue-200/60 rounded-lg text-blue-900 flex items-start gap-2">
            <Radio className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Local Ad-Hoc Mesh Group Active</p>
              <p className="text-blue-800 text-xs mt-0.5">
                Students in Lab 402 are currently working through dynamic programming graph problems and past exam questions.
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Active Peers in Lab 402 (6)
            </h4>
            <div className="space-y-2">
              {[
                { name: 'Aarav Sharma (Tutor)', status: 'Explaining Bellman-Ford proofs', desk: 'Desk 12' },
                { name: 'Rohan Ranmale (You)', status: 'Joined study circle', desk: 'Desk 14' },
                { name: 'Vikram Sen', status: 'Working on adjacency list memory optimizations', desk: 'Desk 15' },
                { name: 'Ananya Roy', status: 'Reviewing graph theory trees', desk: 'Desk 16' },
                { name: 'Siddharth M.', status: 'Writing recursion benchmarks', desk: 'Desk 18' },
                { name: 'Pooja K.', status: 'Solving topological sort problems', desk: 'Desk 19' },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <div>
                      <p className="font-medium text-gray-900">{p.name}</p>
                      <p className="text-[11px] text-gray-500">{p.status}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                    {p.desk}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span>Lab 402 · BVCOE CS Block</span>
            </span>
            <button
              onClick={() => {
                setIsJoined(!isJoined);
                setIsModalOpen(false);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors ${
                isJoined ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isJoined ? 'Leave Study Hall' : 'Check In at Lab 402'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
