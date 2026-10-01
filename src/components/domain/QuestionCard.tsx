import React from 'react';
import { MessageSquare, ThumbsUp, CheckCircle, Bookmark, BookmarkCheck } from 'lucide-react';
import { Question } from '../../types';
import { Avatar } from '../ui/Avatar';

interface QuestionCardProps {
  question: Question;
  onClick?: (question: Question) => void;
  onVote?: (question: Question) => void;
  onBookmark?: (question: Question) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onClick,
  onVote,
  onBookmark,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-xs transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Avatar src={question.authorAvatar} name={question.authorName} size="sm" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-900">{question.authorName}</span>
            <span className="text-[11px] text-gray-500">
              {question.authorYear} · {question.department}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {question.isSolved && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle className="w-3 h-3" />
              <span>Solved</span>
            </span>
          )}
          {onBookmark && (
            <button
              onClick={() => onBookmark(question)}
              aria-label="Bookmark question"
              className="text-gray-400 hover:text-blue-600 p-1 rounded"
            >
              {question.isSaved ? (
                <BookmarkCheck className="w-4 h-4 text-blue-600" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="mt-2.5">
        <h3
          onClick={() => onClick?.(question)}
          className="text-sm sm:text-base font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors leading-snug"
        >
          {question.title}
        </h3>
        <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
          {question.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-1 mt-2.5">
        {question.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[11px] font-medium"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-3 pt-2 flex items-center justify-between border-t border-gray-100 text-xs text-gray-500">
        <span className="text-[11px] text-gray-400">{question.createdAt}</span>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onVote?.(question)}
            className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{question.usefulVotes} helpful</span>
          </button>

          <span
            onClick={() => onClick?.(question)}
            className="flex items-center gap-1 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{question.answersCount} answers</span>
          </span>
        </div>
      </div>
    </div>
  );
};
