import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Plus, CheckCircle2, ShieldCheck, Users, Sparkles, Filter, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { Modal } from '../components/common/Modal';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { skillMatchService } from '../services/skillMatchService';
import { SkillMatch } from '../types';
import { useNavigate } from 'react-router-dom';

export const SkillsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const { currentUser } = useAuth();
  const [canTeach, setCanTeach] = useState([...(currentUser.canTeach || [])]);
  const [wantsToLearn, setWantsToLearn] = useState([...(currentUser.wantsToLearn || [])]);

  // Skill Matching State
  const [selectedMatchSkill, setSelectedMatchSkill] = useState<string | null>(null);
  const [matches, setMatches] = useState<SkillMatch[]>([]);
  const [isMatchingLoading, setIsMatchingLoading] = useState(false);

  useEffect(() => {
    setCanTeach([...(currentUser.canTeach || [])]);
    setWantsToLearn([...(currentUser.wantsToLearn || [])]);
  }, [currentUser]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSkillType, setNewSkillType] = useState<'teach' | 'learn'>('teach');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');

  const handleFindMatches = async (skillName: string) => {
    setSelectedMatchSkill(skillName);
    setIsMatchingLoading(true);
    const offer = canTeach.length > 0 ? canTeach[0].name : undefined;
    const results = await skillMatchService.findMatchesForSkill(skillName, offer);
    setMatches(results);
    setIsMatchingLoading(false);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    if (newSkillType === 'teach') {
      setCanTeach([
        ...canTeach,
        {
          name: newSkillName.trim(),
          level: newSkillLevel,
          verified: false,
          peerCount: 1,
        },
      ]);
      showSuccess(`Added "${newSkillName}" to your teaching repertoire.`);
    } else {
      setWantsToLearn([
        ...wantsToLearn,
        {
          name: newSkillName.trim(),
          level: newSkillLevel,
          priority: 'High',
        },
      ]);
      showSuccess(`Added "${newSkillName}" to your learning roadmap.`);
    }

    setNewSkillName('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Skills & Peer Competencies"
        description="Validated curriculum proficiencies, teaching listings, and skill-swap exchange matrices."
        action={
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill</span>
          </button>
        }
      />

      {/* Overview Metric Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/90 shadow-2xs">
          <span className="text-[11px] text-gray-500 font-medium">Verified Skills</span>
          <p className="text-lg font-bold text-gray-900 mt-0.5">{currentUser.verifiedSkillsCount}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/90 shadow-2xs">
          <span className="text-[11px] text-gray-500 font-medium">Peer Endorsements</span>
          <p className="text-lg font-bold text-gray-900 mt-0.5">52</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/90 shadow-2xs">
          <span className="text-[11px] text-gray-500 font-medium">Can Teach</span>
          <p className="text-lg font-bold text-emerald-700 mt-0.5">{canTeach.length} Topics</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/90 shadow-2xs">
          <span className="text-[11px] text-gray-500 font-medium">Wants to Learn</span>
          <p className="text-lg font-bold text-blue-700 mt-0.5">{wantsToLearn.length} Goals</p>
        </div>
      </div>

      {/* SECTION 1: CAN TEACH */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <h2 className="text-sm sm:text-base font-semibold text-gray-900">
              Can Teach & Mentor
            </h2>
          </div>
          <span className="text-xs text-gray-500">Available for peer requests</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {canTeach.map((skill, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{skill.name}</h3>
                  <span className="text-xs text-gray-500">Proficiency: {skill.level}</span>
                </div>
                {skill.verified ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md text-[11px] font-semibold border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Peer Verified</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[11px] font-medium">
                    Self Reported
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  <span>{skill.peerCount} students tutored</span>
                </span>
                <span className="text-emerald-700 font-medium">Active in Campus Mesh</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: WANTS TO LEARN */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <h2 className="text-sm sm:text-base font-semibold text-gray-900">
              Wants to Learn (Seeking Mentors)
            </h2>
          </div>
          <span className="text-xs text-gray-500">Auto-matches skill swaps</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {wantsToLearn.map((skill, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{skill.name}</h3>
                  <span className="text-xs text-gray-500">Current Target: {skill.level}</span>
                </div>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[11px] font-semibold border border-blue-200">
                  Priority: {skill.priority}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
                <span>Looking for: 1-on-1 walkthroughs</span>
                <button
                  type="button"
                  onClick={() => handleFindMatches(skill.name)}
                  className="text-blue-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Find Mentors</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL: Deterministic Skill Matches */}
      <Modal
        isOpen={!!selectedMatchSkill}
        onClose={() => setSelectedMatchSkill(null)}
        title={`Campus Mentors for "${selectedMatchSkill}"`}
        description="Deterministic peer matching based on syllabus proficiency, reciprocal need, and availability."
        maxWidth="lg"
      >
        <div className="space-y-3">
          {isMatchingLoading ? (
            <div className="py-8 text-center text-xs text-gray-500">
              Calculating deterministic compatibility across campus nodes...
            </div>
          ) : matches.length === 0 ? (
            <div className="py-6 text-center text-xs text-gray-500 space-y-2">
              <p>No mentors currently registered for "{selectedMatchSkill}".</p>
              <p className="text-[11px] text-gray-400">
                A broadcast beacon will notify nearby students on the local mesh network.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[400px] overflow-y-auto">
              {matches.map((match) => (
                <div
                  key={match.peerId}
                  className="p-3.5 bg-white rounded-xl border border-gray-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <img
                      src={match.peerAvatar}
                      alt={match.peerName}
                      className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-sm">{match.peerName}</span>
                        {match.factors.verified && (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                            Verified Tutor
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {match.peerDepartment} · {match.peerYear}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-600 flex-wrap">
                        <span className="font-medium text-blue-700">Teaches: {match.matchingSkill}</span>
                        {match.reciprocalSkill && (
                          <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                            Reciprocal Match: Wants your {match.reciprocalSkill}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900 font-mono">
                        {match.compatibilityScore}%
                      </span>
                      <span className="text-[10px] text-gray-400 block">{match.matchLabel}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMatchSkill(null);
                        navigate('/discover');
                        showSuccess(`Opened session request with ${match.peerName}`);
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                    >
                      Connect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              onClick={() => setSelectedMatchSkill(null)}
              className="px-3.5 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Skill Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Curriculum Skill or Goal"
        description="Share what you can teach or what you want to learn from campus peers."
      >
        <form onSubmit={handleAddSkill} className="space-y-3.5 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setNewSkillType('teach')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center transition-colors ${
                  newSkillType === 'teach'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                I can teach / mentor
              </button>
              <button
                type="button"
                onClick={() => setNewSkillType('learn')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center transition-colors ${
                  newSkillType === 'learn'
                    ? 'bg-blue-50 text-blue-800 border-blue-300'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                I want to learn
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Skill or Subject Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Operating Systems Concurrency, React, DSP..."
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Proficiency Level
            </label>
            <select
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value)}
              className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
            >
              <option value="Beginner">Beginner (Fundamentals)</option>
              <option value="Intermediate">Intermediate (Coursework / Labs)</option>
              <option value="Advanced">Advanced (Projects / Capstone)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="w-full h-9 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full h-9 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-2xs"
            >
              Save Skill
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
