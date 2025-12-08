import React, { useState, useEffect } from "react";
import { quizAPI } from "../services/api";

import QuizCard from "../components/QuizCard";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

import { Search } from "lucide-react";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
    maxButtons: 5
  });

  useEffect(() => {
    fetchQuizzes();
  }, [page, search]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await quizAPI.getAllQuizzes({
        page,
        limit: 12,
        search,
      });

      // Handle both response formats
      if (response.success) {
        setQuizzes(response.data.quizzes);
        setPagination(response.data.pagination);
      } else {
        setQuizzes(response.data.quizzes);
      }
    } catch (err) {
      setError("Failed to load quizzes");
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
      <div className="bg-black backdrop-blur-lg rounded-2xl p-8 mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Available Quizzes
        </h1>
        <p className="text-white/90 text-lg font-semibold mb-6">
          Browse and take quizzes created by our community
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)} // to be implemented
              placeholder="Search quizzes..."
              className="w-full p-3 rounded-lg text-base
                focus:outline-none focus:ring-2 focus:ring-gray-400 text-black bg-white flex-4/5"
              disabled
            />
            <button
              disabled
              type="submit"
              className="btn btn-primary px-6 bg-white rounded-lg text-md font-semibold transform hover:scale-95"
            >
              <Search />
            </button>
          </div>
        </form>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError("")} />}

      {/* Quiz Grid */}
      {quizzes.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            No quizzes found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or create a new quiz
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="h-full">
                <QuizCard quiz={quiz} className="min-h-[240px] flex flex-col" />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div>
            {pagination && pagination.totalPages > 1 && (
              <Pagination
                {...pagination}
                onPageChange={setPage}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default QuizList;
