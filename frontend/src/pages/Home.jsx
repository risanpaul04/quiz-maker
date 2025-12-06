import React from 'react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: '📝',
      title: 'Create Quizzes',
      description: 'Build custom quizzes with multiple-choice questions and answers'
    },
    {
      icon: '🎯',
      title: 'Take Quizzes',
      description: 'Test your knowledge by taking quizzes created by other users'
    },
    {
      icon: '📊',
      title: 'Track Results',
      description: 'View your scores and see correct answers after completing quizzes'
    },
    {
      icon: '👥',
      title: 'User Accounts',
      description: 'Register and login to save your quizzes and track your progress'
    },
    {
      icon: '📱',
      title: 'Mobile Responsive',
      description: 'Access quizzes on any device - desktop, tablet, or mobile'
    },
    {
      icon: '🔍',
      title: 'Browse Quizzes',
      description: 'Explore a wide variety of quizzes from the community'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Welcome to <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">Quiz Maker</span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Create engaging quizzes and test your knowledge with our interactive platform
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Link to="/create-quiz" className="btn btn-primary text-lg px-8 py-4">
                  Create Quiz
                </Link>
                <Link to="/quizzes" className="btn btn-outline text-lg px-8 py-4">
                  Browse Quizzes
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary text-lg px-8 py-4">
                  Get Started
                </Link>
                <Link to="/quizzes" className="btn btn-outline text-lg px-8 py-4">
                  View Quizzes
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="text-center py-16">
          <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join our community and start creating amazing quizzes today!
            </p>
            <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4">
              Sign Up Now
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;