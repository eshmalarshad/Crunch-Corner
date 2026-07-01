import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiArrowLeft, FiCheckCircle, FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase/firebase.config";
import welcomeLogo from "../assets/crunch-corner-welcome-logo.png";

// Helper function to check if user is admin
const isAdmin = (user) => {
  return user && (user.role === "admin" || user.role === "Admin");
};

export default function Login() {
  const navigate = useNavigate();
  const { login, resendVerificationEmail, refreshUser, logout, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [resending, setResending] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      if (result.user && !result.user.emailVerified) {
        setShowVerification(true);
        toast.error("Please verify your email first!");
      } else {
        toast.success("Login successful!");
        if (isAdmin(result.user)) {
          navigate("/admin");
        } else {
          navigate("/menu");
        }
      }
    } else {
      toast.error(result.msg);
    }
  };

  const handleResend = async () => {
    setResending(true);
    const result = await resendVerificationEmail();
    setResending(false);
    if (result.success) {
      toast.success("Verification email resent!");
    } else {
      toast.error(result.msg);
    }
  };

  const handleCheckVerification = async () => {
    setCheckingVerification(true);
    await refreshUser();
    setCheckingVerification(false);
    if (auth.currentUser && auth.currentUser.emailVerified) {
      toast.success("Email verified!");
      // Wait a tiny bit for state to update then check user
      setTimeout(() => {
        if (isAdmin(user)) {
          navigate("/admin");
        } else {
          navigate("/menu");
        }
      }, 100);
    } else {
      toast.error("Email not verified yet. Please check your Gmail.");
    }
  };

  const handleBackToLogin = async () => {
    await logout();
    setShowVerification(false);
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-primary-50 dark:bg-warmGray-950 overflow-hidden p-6">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        onClick={() => navigate("/welcome")}
        className="absolute top-6 left-6 p-2 rounded-full bg-primary-100 dark:bg-warmGray-800 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-warmGray-700 transition-all duration-200"
      >
        <FiArrowLeft className="w-5 h-5" />
      </motion.button>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <img
          src={welcomeLogo}
          alt="Crunch Corner"
          className="w-48 h-auto object-contain"
        />
      </motion.div>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-sm bg-white dark:bg-warmGray-900 rounded-2xl shadow-xl p-8 border border-primary-100 dark:border-warmGray-800"
      >
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-extrabold text-primary-600 dark:text-primary-400 mb-2">
            {showVerification ? "Verify Your Email" : "Welcome Back!"}
          </h1>
          <p className="text-warmGray-600 dark:text-warmGray-400 text-sm">
            {showVerification
              ? "We've sent a verification link to your Gmail"
              : "Login to continue your food journey"}
          </p>
        </motion.div>

        {!showVerification ? (
          <>
            {/* INPUTS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="space-y-5"
            >
              {/* Email Input */}
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-warmGray-500 dark:text-warmGray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-primary-50 dark:bg-warmGray-800 border-2 border-warmGray-200 dark:border-warmGray-700 rounded-xl focus:outline-none focus:border-primary-400 dark:focus:border-primary-500 text-warmGray-900 dark:text-white transition-all duration-200"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-warmGray-500 dark:text-warmGray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-primary-50 dark:bg-warmGray-800 border-2 border-warmGray-200 dark:border-warmGray-700 rounded-xl focus:outline-none focus:border-primary-400 dark:focus:border-primary-500 text-warmGray-900 dark:text-white transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-warmGray-500 dark:text-warmGray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0-8.268-2.943-9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0-8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </motion.div>

            {/* BUTTON */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogin}
              disabled={loading}
              className="w-full mt-8 bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>

            {/* LINK */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="text-center mt-6"
            >
              <p className="text-warmGray-600 dark:text-warmGray-400 text-sm">
                Don't have an account?{" "}
                <span
                  onClick={() => navigate("/register")}
                  className="text-primary-600 dark:text-primary-400 font-semibold cursor-pointer hover:underline transition-colors duration-200"
                >
                  Create new account
                </span>
              </p>
            </motion.div>
          </>
        ) : (
          <>
            {/* Verification UI */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="text-center space-y-6"
            >
              <div className="mx-auto w-20 h-20 bg-primary-100 dark:bg-warmGray-800 rounded-full flex items-center justify-center">
                <FiMail className="w-10 h-10 text-primary-600 dark:text-primary-400" />
              </div>

              <p className="text-warmGray-700 dark:text-warmGray-300">
                We've sent a verification link to your Gmail
              </p>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCheckVerification}
                  disabled={checkingVerification}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {checkingVerification ? (
                    <>
                      <FiRefreshCw className="w-5 h-5 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="w-5 h-5" />
                      I've Verified My Email
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleResend}
                  disabled={resending}
                  className="w-full bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-warmGray-800 font-bold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50"
                >
                  {resending ? "Resending..." : "Resend Verification Email"}
                </motion.button>

                <motion.button
                  whileHover={{ textDecoration: "underline" }}
                  onClick={handleBackToLogin}
                  className="text-warmGray-500 dark:text-warmGray-400 text-sm"
                >
                  Back to Login
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
