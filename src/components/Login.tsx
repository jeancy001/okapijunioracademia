import React, { useState } from "react";
import { useAuth } from "../context/AuthContex";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import type { AxiosError } from "axios";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      setEmail("");
      setPassword("");
      navigate("/myClass");
    } catch (err: unknown) {
      let message = "Login failed";
      if (err && typeof err === "object") {
        const axiosError = err as AxiosError<{ message: string }>;
        message = axiosError.response?.data.message || axiosError.message || message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1c23] p-4">
      <div className="max-w-md w-full bg-[#1f212b] rounded-3xl shadow-2xl p-10 border border-gray-700">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#2a2d3a] p-4 rounded-full mb-3 shadow-inner">
            <User className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-blue-400 text-center leading-snug">
            Okapi Junior Academia
          </h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-800 text-red-400 p-3 mb-5 rounded-md text-center font-medium border border-red-700 shadow-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-600 bg-[#2a2d3a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-600 bg-[#2a2d3a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-200"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition shadow-md ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-gray-400">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-blue-400 font-semibold hover:underline transition-colors"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
