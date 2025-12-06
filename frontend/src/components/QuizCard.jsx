import React from 'react';
import { Link } from 'react-router';

const QuizCard = ({ quiz }) => {
  return (
    <div className="card transform hover:scale-105">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{quiz.title}</h3>
          <span className="text-2xl">📝</span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {quiz.description || 'No description available'}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              {quiz.questions?.length || quiz.questionCount || 0} Questions
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              {quiz.creator?.name || quiz.creatorInfo?.name || 'Anonymous'}
            </span>
          </div>
        </div>
        
        {quiz.attemptCount !== undefined && (
          <div className="text-xs text-gray-500 mb-4">
            {quiz.attemptCount} attempts • Avg: {quiz.averageScore?.toFixed(1) || 0}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {new Date(quiz.createdAt).toLocaleDateString()}
          </span>
          <Link to={`/quiz/${quiz._id}`} className="btn btn-primary text-sm">
            Take Quiz →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;