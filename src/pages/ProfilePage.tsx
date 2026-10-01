import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { DEFAULT_CAMPUS } from '../constants/app';
import { useAuth } from '../context/AuthContext';
import { karmaRepository } from '../repositories';
import { KarmaTransaction } from '../types';
import { Avatar } from '../components/ui/Avatar';
import {
  Edit3,
  Award,
  BookOpen,
  Users,
  FileText,
  Clock,
  Languages,
  CheckCircle,
  ShieldCheck,
  Radio,
  UserCheck,
  TrendingUp,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isAdmin, openLoginModal } = useAuth();
  const [karmaTransactions, setKarmaTransactions] = useState<KarmaTransaction[]>([]);
  const [totalKarma, setTotalKarma] = useState(currentUser.karma);

  useEffect(() => {
    karmaRepository.getTransactions('current_user').then((txs) => {
      setKarmaTransactions(txs);
      const sum = txs.reduce((acc, t) => acc + t.amount, 0);
      setTotalKarma(sum > 0 ? sum : currentUser.karma);
    });
  }, [currentUser]);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={isAdmin ? 'Faculty Administrator Profile' : 'Student Academic Profile'}
        description={`${DEFAULT_CAMPUS.name} (${DEFAULT_CAMPUS.shortName})`}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={openLoginModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-300 bg-purple-50 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Switch User</span>
            </button>
            <button
              onClick={() => navigate('/profile/edit')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </div>
        }
      />

      {/* Profile Header Box */}
      <div className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar src={currentUser.avatar} name={currentUser.name} size="xl" />
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">{currentUser.name}</h2>
              {isAdmin ? (
                <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-xs font-bold">
                  HOD & Academic Controller
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
                  Roll: {currentUser.rollNo}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">
              {currentUser.year ? `${currentUser.year} · ` : ''}{currentUser.department}
            </p>
            <p className="text-xs text-gray-500 max-w-xl leading-relaxed">{currentUser.bio}</p>
          </div>
        </div>

        {/* Academic Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-gray-100">
          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <span className="text-[11px] text-gray-400 font-medium block">Academic Karma</span>
            <span className="text-base font-bold text-blue-600">{totalKarma} pts</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <span className="text-[11px] text-gray-400 font-medium block">Verified Skills</span>
            <span className="text-base font-bold text-emerald-700">
              {currentUser.verifiedSkillsCount}
            </span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <span className="text-[11px] text-gray-400 font-medium block">Peer Sessions</span>
            <span className="text-base font-bold text-gray-900">
              {currentUser.mentoringSessionsCount}
            </span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <span className="text-[11px] text-gray-400 font-medium block">Resources Shared</span>
            <span className="text-base font-bold text-gray-900">
              {currentUser.resourcesContributedCount}
            </span>
          </div>
        </div>
      </div>

      {/* TRANSPARENT KARMA TRANSACTION LEDGER */}
      <div className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900">
              Transparent Karma Ledger ({karmaTransactions.length} events)
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Total: {totalKarma} pts
          </span>
        </div>
        <p className="text-xs text-gray-500">
          Karma is never arbitrarily assigned; it reflects auditable academic contributions and completed peer learning events.
        </p>

        <div className="space-y-2 pt-1">
          {karmaTransactions.map((tx) => (
            <div
              key={tx.id}
              className="p-2.5 bg-gray-50/70 rounded-lg border border-gray-100 flex items-center justify-between gap-3 text-xs"
            >
              <div className="min-w-0">
                <span className="font-semibold text-gray-900 block truncate">{tx.description}</span>
                <span className="text-[11px] text-gray-400">{tx.timestamp} · Verified Event</span>
              </div>
              <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded text-xs shrink-0 border border-emerald-200">
                +{tx.amount} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Matrix: Can Teach vs Wants to Learn */}
      {currentUser.canTeach && currentUser.canTeach.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Can Teach */}
          <div className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>Can Teach</span>
              </h3>
              <span className="text-[11px] text-gray-400">{currentUser.canTeach.length} subjects</span>
            </div>
            <div className="space-y-2">
              {currentUser.canTeach.map((s, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{s.name}</p>
                    <p className="text-[11px] text-gray-500">{s.level} · {s.peerCount} tutored</p>
                  </div>
                  {s.verified && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                      <CheckCircle className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Wants to Learn */}
          <div className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>Wants to Learn</span>
              </h3>
              <span className="text-[11px] text-gray-400">
                {currentUser.wantsToLearn?.length || 0} goals
              </span>
            </div>
            <div className="space-y-2">
              {(currentUser.wantsToLearn || []).map((s, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{s.name}</p>
                    <p className="text-[11px] text-gray-500">Target: {s.level}</p>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-semibold">
                    Priority: {s.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Availability, Languages & Verified Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Availability & Languages */}
        <div className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-xs space-y-3 text-xs">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Availability & Languages</h3>
          <div className="space-y-2 text-gray-600">
            {currentUser.availability && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{currentUser.availability}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{currentUser.languages.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Academic Badges */}
        <div className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-xs space-y-3">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Academic Badges</h3>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {currentUser.badges.map((b) => (
              <div key={b.id} className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100">
                <Award className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <span className="font-semibold text-gray-900 block truncate">{b.name}</span>
                <span className="text-[10px] text-gray-400">{b.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
