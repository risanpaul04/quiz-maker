import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import QuizList from './pages/QuizList';
import QuizCreation from './pages/QuizCreation';
import QuizTaking from './pages/QuizTaking';
import QuizResults from './pages/QuizResults';
import MyQuizzes from './pages/MyQuizzes';
import MyResults from './pages/MyResults';
import Roadmap from './pages/Roadmap.jsx';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/quizzes" element={<QuizList />} />
              <Route 
                path="/create-quiz" 
                element={
                  <PrivateRoute>
                    <QuizCreation />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/quiz/:id" 
                element={
                  <PrivateRoute>
                    <QuizTaking />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/results/:id" 
                element={
                  <PrivateRoute>
                    <QuizResults />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/my-quizzes" 
                element={
                  <PrivateRoute>
                    <MyQuizzes />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/my-results" 
                element={
                  <PrivateRoute>
                    <MyResults />
                  </PrivateRoute>
                } 
              />
              <Route
                path='/roadmap'
                element={
                  <Roadmap />
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;