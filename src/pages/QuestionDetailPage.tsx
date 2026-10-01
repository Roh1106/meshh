import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { questionService } from '../services/questionService';
import { Question } from '../types';
import { Spinner } from '../components/ui/Spinner';
import { ErrorState } from '../components/ui/ErrorState';
import { Avatar } from '../components/ui/Avatar';
import { ThumbsUp, CheckCircle, MessageSquare, Send } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const QuestionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const { currentUser } = useAuth();

  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const item = await questionService.getQuestionById(id);
        if (mounted && item) setQuestion(item);
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

  if (!question) {
    return (
      <div className="py-10">
        <ErrorState
          title="Question Not Found"
          message="This academic discussion does not exist or has been archived."
          onRetry={() => navigate('/questions')}
        />
      </div>
    );
  }

  const handlePostReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newAns = {
      id: `ans_${Date.now()}`,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorDepartment: `${currentUser.department} (${currentUser.year || 'Student'})`,
      createdAt: 'Just now',
      content: replyText.trim(),
      votes: 0,
      isAccepted: false,
    };

    setQuestion({
      ...question,
      answersCount: question.answersCount + 1,
      answers: [...(question.answers || []), newAns],
    });

    setReplyText('');
    showSuccess('Your answer has been added to the peer discussion.');
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader title={question.title} backTo="/questions" />

      {/* Main Question Body */}
      <div className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <Avatar src={question.authorAvatar} name={question.authorName} size="md" />
            <div>
              <p className="text-xs sm:text-sm font-semibold text-gray-900">{question.authorName}</p>
              <p className="text-[11px] text-gray-500">
                {question.authorYear} · {question.department}
              </p>
            </div>
          </div>
          <span className="text-xs text-gray-400">{question.createdAt}</span>
        </div>

        <p className="text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
          {question.description}
        </p>

        <div className="flex flex-wrap gap-1.5 pt-2">
          {question.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Answers Section */}
      <div className="space-y-4">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900">
          Peer Answers ({question.answers?.length || 0})
        </h3>

        {question.answers && question.answers.length > 0 ? (
          <div className="space-y-3">
            {question.answers.map((ans) => (
              <div
                key={ans.id}
                className={`bg-white rounded-xl border p-4 shadow-xs space-y-2.5 ${
                  ans.isAccepted ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-gray-200/90'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar src={ans.authorAvatar} name={ans.authorName} size="sm" />
                    <div>
                      <span className="text-xs font-semibold text-gray-900">{ans.authorName}</span>
                      <span className="text-[11px] text-gray-500 block">{ans.authorDepartment}</span>
                    </div>
                  </div>
                  {ans.isAccepted && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-semibold">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Accepted Answer</span>
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">{ans.content}</p>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>{ans.createdAt}</span>
                  <div className="flex items-center gap-1 font-medium">
                    <ThumbsUp className="w-3.5 h-3.5 text-blue-600" />
                    <span>{ans.votes} helpful votes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic p-4 bg-white rounded-xl border border-gray-200 text-center">
            No answers posted yet. Help your classmate by writing a verified response below.
          </p>
        )}

        {/* Post Answer Form */}
        <form onSubmit={handlePostReply} className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-xs space-y-3">
          <h4 className="text-xs font-semibold text-gray-700">Write an Academic Solution</h4>
          <textarea
            rows={3}
            required
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Provide step-by-step reasoning or cite academic course notes..."
            className="w-full rounded-lg border border-gray-300 p-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Answer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
