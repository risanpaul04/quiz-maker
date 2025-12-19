import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import ErrorMessage from "../components/ErrorMessage";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate("/quizzes");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Login to your account</p>
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError("")} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="input w-full p-3 border border-gray-300 text-base 
                        focus:outline-none focus:ring-2 
                        focus:ring-blue-600 focus:border-blue-600 
                        rounded-lg transition duration-150"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="input w-full p-3 border border-gray-300 
                        focus:outline-none focus:ring-2 
                        focus:ring-blue-600 focus:border-blue-600 
                        rounded-lg transition duration-150"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full m-auto p-3 bg-blue-400 py-3 text-lg font-bold text-white hover:bg-blue-500 rounded-lg transition duration-100"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500 hover:text-blue-800 font-medium"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
