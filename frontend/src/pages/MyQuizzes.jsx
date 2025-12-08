import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { quizAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const MyQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchMyQuizzes();
  }, []);

  const fetchMyQuizzes = async () => {
    try {
      const response = await quizAPI.getUserQuizzes();
      setQuizzes(response.data.quizzes);

    } catch (err) {
      setError('Failed to load your quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(quizId);
    try {
      await quizAPI.deleteQuiz(quizId);
      setQuizzes(quizzes.filter(quiz => quiz._id !== quizId));
    } catch (err) {
      setError('Failed to delete quiz');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Quizzes</h1>
          <p className="text-gray-600 mt-1">Manage your created quizzes</p>
        </div>
        <Link to="/create-quiz" className="btn btn-primary">
          + Create New Quiz
        </Link>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

      {/* Quiz List */}
      {quizzes.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No quizzes yet</h3>
          <p className="text-gray-600 mb-6">Create your first quiz to get started!</p>
          <Link to="/create-quiz" className="btn btn-primary">
            Create Your First Quiz
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Questions</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Created</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {quizzes.map((quiz) => (
                  <tr key={quiz._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-bold text-gray-800">{quiz.title}</div>
                        {quiz.description && (
                          <div className="text-sm text-gray-600 truncate max-w-xs">
                            {quiz.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {quiz.questions.length}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        quiz.isPublic 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {quiz.isPublic ? 'Public' : 'Private'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {new Date(quiz.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/quiz/${quiz._id}`}
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(quiz._id)}
                          disabled={deleteLoading === quiz._id}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium disabled:opacity-50"
                        >
                          {deleteLoading === quiz._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-200">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{quiz.title}</h3>
                  {quiz.description && (
                    <p className="text-sm text-gray-600 mt-1">{quiz.description}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>📝 {quiz.questions.length} questions</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    quiz.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {quiz.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
                
                <div className="text-xs text-gray-500">
                  Created: {new Date(quiz.createdAt).toLocaleDateString()}
                </div>
                
                <div className="flex gap-2">
                  <Link
                    to={`/quiz/${quiz._id}`}
                    className="btn btn-primary flex-1 text-sm text-center bg-blue-600  text-white rounded-md"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(quiz._id)}
                    disabled={deleteLoading === quiz._id}
                    className="btn btn-danger flex-1 text-sm text-center bg-red-600 text-white rounded-md"
                  >
                    {deleteLoading === quiz._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyQuizzes;