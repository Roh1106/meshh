import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { QuestionCard } from '../components/domain/QuestionCard';
import { SearchBar } from '../components/ui/SearchBar';
import { EmptyState } from '../components/ui/EmptyState';
import { CardSkeleton } from '../components/ui/Skeleton';
import { questionService } from '../services/questionService';
import { Question } from '../types';
import { Plus, CheckCircle, HelpCircle } from 'lucide-react';
import { Modal } from '../components/common/Modal';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const QuestionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showInfo } = useToast();
  const { currentUser } = useAuth();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [solvedOnly, setSolvedOnly] = useState(false);

  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTags, setNewTags] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchQ = async () => {
      setIsLoading(true);
      try {
        const data = await questionService.getQuestions({
          query: searchQuery,
          solvedOnly,
        });
        if (mounted) setQuestions(data);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchQ();
    return () => {
      mounted = false;
    };
  }, [searchQuery, solvedOnly]);

  const handleAskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const tagsArray = newTags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    await questionService.addQuestion({
      title: newTitle,
      description: newDesc,
      tags: tagsArray.length > 0 ? tagsArray : ['General'],
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorYear: currentUser.year || 'Student',
      department: currentUser.department,
    });

    showSuccess('Your doubt has been broadcast to campus peers and offline mesh neighbors.', 'Question Posted');
    setIsAskModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    setNewTags('');

    // reload
    const updated = await questionService.getQuestions();
    setQuestions(updated);
  };

  const handleVote = async (q: Question) => {
    const votes = await questionService.toggleUsefulVote(q.id);
    setQuestions((prev) =>
      prev.map((item) => (item.id === q.id ? { ...item, usefulVotes: votes } : item))
    );
    showInfo('Marked as helpful question.');
  };

  return (
    <div className="space-y-4 pb-12">
      <PageHeader
        title="Academic Q&A Forum"
        description="Ask curriculum doubts, review peer solutions, and vote on verified professor-approved answers."
        action={
          <button
            onClick={() => setIsAskModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ask Question</span>
          </button>
        }
      />

      <div className="space-y-2.5">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search questions by topic, algorithm, or syllabus tags..."
        />

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setSolvedOnly(!solvedOnly)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium border transition-colors ${
              solvedOnly
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Solved Only</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2">
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : questions.length === 0 ? (
          <EmptyState
            title="No questions found"
            description="Be the first to post a question for your department peers or study group."
            actionLabel="Ask Question"
            onAction={() => setIsAskModalOpen(true)}
          />
        ) : (
          questions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              onClick={(item) => navigate(`/questions/${item.id}`)}
              onVote={handleVote}
            />
          ))
        )}
      </div>

      {/* Ask Question Modal */}
      <Modal
        isOpen={isAskModalOpen}
        onClose={() => setIsAskModalOpen(false)}
        title="Post Academic Doubt"
        description="Reach out to students in your department or senior peer tutors."
      >
        <form onSubmit={handleAskSubmit} className="space-y-3.5 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Question Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. How does virtual memory paging handle page faults in kernel space?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Context & Explanation
            </label>
            <textarea
              rows={4}
              required
              placeholder="Explain where you got stuck or what you have tried so far..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="DBMS, 3NF, Normalization, Algorithms"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAskModalOpen(false)}
              className="w-full h-9 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full h-9 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-2xs"
            >
              Submit Doubt
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
