import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="bg-amber-400 backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">📝</span>
            <span className="text-xl font-bold bg-gradient-to-r from-amber-800 to-purple-600 bg-clip-text text-transparent">
              Quizzard
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/quizzes" className="text-gray-700 hover:text-primary-600 font-medium transition">
              All Quizzes
            </Link>
            {user ? (
              <>
                <Link to="/create-quiz" className="text-gray-700 hover:text-primary-600 font-bold transition">
                  Create Quiz
                </Link>
                <Link to="/my-quizzes" className="text-gray-700 hover:text-primary-600 font-semibold transition">
                  My Quizzes
                </Link>
                <Link to="/my-results" className="text-gray-700 hover:text-primary-600 font-medium transition">
                  My Results
                </Link>
                <Link to="/roadmap" className="text-gray-700 hover:text-primary-600 font-medium transition">
                  Roadmap
                </Link>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700 font-medium">{user.name}</span>
                  <button onClick={handleLogout} className="btn btn-outline text-sm">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 font-bold transition">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary font-semibold">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 hover:text-primary-600 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link to="/quizzes" className="block py-2 text-gray-700 hover:text-primary-600" onClick={() => setIsOpen(false)}>
              All Quizzes
            </Link>

            {user ? (
              <>
                <Link to="/create-quiz" className="block py-2 text-gray-700 hover:text-primary-600" onClick={() => setIsOpen(false)}>
                  Create Quiz
                </Link>
                <Link to="/my-quizzes" className="block py-2 text-gray-700 hover:text-primary-600" onClick={() => setIsOpen(false)}>
                  My Quizzes
                </Link>
                <Link to="/my-results" className="block py-2 text-gray-700 hover:text-primary-600" onClick={() => setIsOpen(false)}>
                  My Results
                </Link>
                <Link to="/roadmap" className="block py-2 text-gray-700 hover:text-primary-600" onClick={() => setIsOpen(false)}>
                  Roadmap
                </Link>


                <div className="py-2 text-gray-700 font-medium">{user.name}</div>
                <button onClick={handleLogout} className="w-full btn btn-outline text-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 text-gray-700 hover:text-primary-600" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="block py-2" onClick={() => setIsOpen(false)}>
                  <button className="w-full btn btn-primary text-sm">Register</button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;