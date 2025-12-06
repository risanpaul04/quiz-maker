import React, { useState, useEffect } from 'react';
import { quizAPI } from '../services/api';
import QuizCard from '../components/QuizCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, [page, search]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await quizAPI.getAllQuizzes(
      { 
        page, 
        limit: 12,
        search 
      }
    );
      
      // Handle both response formats
      
      if (response.data.success) {
        setQuizzes(response.data.quizzes);
        setPagination(response.data.pagination);
      } else {
        setQuizzes(response.data.quizzes);
      }
    } catch (err) {
      setError('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchQuizzes();
  };

  if (loading && page === 1) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Available Quizzes</h1>
        <p className="text-white/90 text-lg mb-6">Browse and take quizzes created by our community</p>
        
        {/* Search */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quizzes..."
              className="flex-1 px-4 py-3 rounded-lg border-2 border-transparent focus:border-white focus:outline-none"
            />
            <button type="submit" className="btn btn-primary px-6">
              Search
            </button>
          </div>
        </form>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

      {/* Quiz Grid */}
      {quizzes.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No quizzes found</h3>
          <p className="text-gray-600">Try adjusting your search or create a new quiz</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz._id} quiz={quiz} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <button
                onClick={() => setPage(page - 1)}
                disabled={!pagination.hasPrevPage}
                className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="text-white font-medium">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => setPage(page + 1)}
                disabled={!pagination.hasNextPage}
                className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuizList;