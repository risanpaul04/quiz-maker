import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { resultAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const MyResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyResults();
  }, []);

  const fetchMyResults = async () => {
    try {
      const response = await resultAPI.getUserResults();
      setResults(response.data);
    } catch (err) {
      setError('Failed to load your results');
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (score, total) => {
    return ((score / total) * 100).toFixed(1);
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A', color: 'bg-green-500' };
    if (percentage >= 80) return { grade: 'B', color: 'bg-blue-500' };
    if (percentage >= 70) return { grade: 'C', color: 'bg-yellow-500' };
    if (percentage >= 60) return { grade: 'D', color: 'bg-orange-500' };
    return { grade: 'F', color: 'bg-red-500' };
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const averageScore = results.length > 0
    ? (results.reduce((acc, r) => acc + parseFloat(calculatePercentage(r.score, r.totalQuestions)), 0) / results.length).toFixed(1)
    : 0;

  const passedCount = results.filter(r => calculatePercentage(r.score, r.totalQuestions) >= 50).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Results</h1>
            <p className="text-gray-600 mt-1">Track your quiz performance</p>
          </div>
          <Link to="/quizzes" className="btn btn-primary">
            Take More Quizzes
          </Link>
        </div>

        {/* Stats Summary */}
        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="text-4xl font-bold mb-2">{results.length}</div>
              <div className="text-white/90">Quizzes Taken</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
              <div className="text-4xl font-bold mb-2">{averageScore}%</div>
              <div className="text-white/90">Average Score</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-6 text-white">
              <div className="text-4xl font-bold mb-2">{passedCount}</div>
              <div className="text-white/90">Quizzes Passed</div>
            </div>
          </div>
        )}
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

      {/* Results List */}
      {results.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No results yet</h3>
          <p className="text-gray-600 mb-6">Take a quiz to see your results here!</p>
          <Link to="/quizzes" className="btn btn-primary">
            Browse Quizzes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((result) => {
            const percentage = calculatePercentage(result.score, result.totalQuestions);
            const { grade, color } = getGrade(percentage);

            return (
              <div key={result._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800 flex-1">
                      {result.quiz?.title || 'Quiz'}
                    </h3>
                    <span className={`${color} text-white px-3 py-1 rounded-full font-bold text-lg`}>
                      {grade}
                    </span>
                  </div>

                  {/* Score Display */}
                  <div className="mb-4">
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-4xl font-bold text-gray-800">{percentage}%</span>
                      <span className="text-gray-600 pb-1">
                        ({result.score}/{result.totalQuestions})
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`${color} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {new Date(result.completedAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {new Date(result.completedAt).toLocaleTimeString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/results/${result._id}`}
                      className="btn btn-secondary flex-1 text-sm"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/quiz/${result.quiz?._id || result.quiz}`}
                      className="btn btn-primary flex-1 text-sm"
                    >
                      Retake Quiz
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyResults;