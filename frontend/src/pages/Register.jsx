import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';
import ErrorMessage from '../components/ErrorMessage';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 5) {
      setError('Password must be at least 5 characters');
      return;
    }

    setLoading(true);

    try {
      await signup(formData.username, formData.email, formData.password);
      navigate('/quizzes');
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-600 mt-2">Join our quiz community</p>
        </div>
        
        {error && <ErrorMessage message={error} onClose={() => setError('')} />}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <InputField
            id='username'
            label='Username'
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeHolder='John Doe'
          ></InputField>

          <InputField
            id="email"
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeHolder='you@example.com'
          ></InputField>

          <InputField
            id="password"
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="At least 5 characters"
            required
          ></InputField>

          <InputField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="At least 5 characters"
            required
          ></InputField>

          <button 
            type="submit" 
            className="w-full btn btn-primary py-3 text-lg"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                Registering...
              </span>
            ) : (
              'Register'
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:text-blue-800 font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;