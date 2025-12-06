import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { resultAPI, quizAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const QuizResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [result, setResult] = useState(location.state?.result || null);
  const [quiz, setQuiz] = useState(location.state?.quiz || null);
  const [loading, setLoading] = useState(!location.state?.result);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!result && id !== 'latest') {
      fetchResult();
    } else if (result && !quiz) {
      fetchQuizDetails();
    }
  }, [id, result]);

  const fetchResult = async () => {
    try {
      const response = await resultAPI.getResultById(id);
      setResult(response.data);
      setQuiz(response.data.quiz);
    } catch (err) {
      setError('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizDetails = async () => {
    try {
      const response = await quizAPI.getQuizById(result.quiz || result.quizId);
      setQuiz(response.data);
    } catch (err) {
      console.error('Failed to load quiz details');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto text-center text-white">
        <h2 className="text-2xl font-bold">Results not found</h2>
      </div>
    );
  }

  const percentage = result.percentage || ((result.score / result.totalQuestions) * 100).toFixed(2);
  const passed = percentage >= 50;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Results</h1>
        {quiz && <h2 className="text-xl text-gray-600">{quiz.title}</h2>}
      </div>

      {/* Score Summary */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col md:flex-row items-center justify-around gap-8">
          {/* Score Circle */}
          <div className="relative">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="#e5e7eb"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke={passed ? '#48bb78' : '#f56565'}
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${(percentage / 100) * 553} 553`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-gray-800">{percentage}%</span>
              <span className="text-gray-600">{result.score}/{result.totalQuestions}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 flex-1">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{result.score}</div>
              <div className="text-gray-600 font-medium">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {result.totalQuestions - result.score}
              </div>
              <div className="text-gray-600 font-medium">Incorrect</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">{result.totalQuestions}</div>
              <div className="text-gray-600 font-medium">Total</div>
            </div>
          </div>
        </div>

        {/* Result Message */}
        <div className={`mt-8 p-6 rounded-xl text-center ${
          passed ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          <div className="text-4xl mb-2">{passed ? '🎉' : '📚'}</div>
          <div className="text-xl font-bold">
            {passed ? 'Congratulations! You passed!' : 'Keep practicing!'}
          </div>
        </div>
      </div>

      {/* Answers Review */}
      {result.answers && quiz && quiz.questions && (
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Review Your Answers</h3>
          <div className="space-y-6">
            {quiz.questions.map((question, index) => {
              const userAnswer = result.answers.find(
                a => a.questionId?.toString() === question._id?.toString()
              );
              const isCorrect = userAnswer?.isCorrect;

              return (
                <div
                  key={question._id}
                  className={`border-2 rounded-xl p-6 ${
                    isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-800 flex-1">
                      Question {index + 1}: {question.questionText}
                    </h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isCorrect 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {question.options.map((option, optIndex) => {
                      const isUserAnswer = userAnswer?.selectedAnswer === option.text;
                      const isCorrectAnswer = option.isCorrect;

                      return (
                        <div
                          key={optIndex}
                          className={`p-4 rounded-lg border-2 ${
                            isCorrectAnswer
                              ? 'border-green-500 bg-green-100'
                              : isUserAnswer
                              ? 'border-red-500 bg-red-100'
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center flex-1">
                              <span className="font-medium text-gray-700 mr-3">
                                {String.fromCharCode(65 + optIndex)}.
                              </span>
                              <span className="text-gray-800">{option.text}</span>
                            </div>
                            {isCorrectAnswer && (
                              <span className="text-green-600 font-medium flex items-center">
                                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Correct Answer
                              </span>
                            )}
                            {isUserAnswer && !isCorrectAnswer && (
                              <span className="text-red-600 font-medium flex items-center">
                                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                Your Answer
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/quizzes')}
            className="btn btn-primary flex-1 py-3"
          >
            Browse More Quizzes
          </button>
          <button
            onClick={() => navigate('/my-results')}
            className="btn btn-secondary flex-1 py-3"
          >
            View All Results
          </button>
          {quiz && (
            <button
              onClick={() => navigate(`/quiz/${quiz._id}`)}
              className="btn bg-purple-500 text-white hover:bg-purple-600 flex-1 py-3"
            >
              Retake Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizResults;