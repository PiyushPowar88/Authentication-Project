import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Access the login function from zustand store
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-900">
      {/* Flexbox container to center the login box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        // Increased max-width, padding, and height
        className="w-full max-w-[1400px] p-20 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden min-h-[800px]"
      >
        <div className="p-20">
          <h2 className="text-5xl font-bold mb-10 text-center bg-gradient-to-r from-red-800 to-emerald-500 text-transparent bg-clip-text">
            Welcome Back
          </h2>

          <form onSubmit={handleLogin}>
            <Input
              Icon={Mail}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // Further increase the input box size
              className="text-xl py-6 px-8 w-full bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <Input
              Icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // Further increase the input box size
              className="text-xl py-6 px-8 w-full bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mt-8"
            />

            <div className="flex items-center mb-8 mt-6">
              <Link
                to="/forgot-password"
                className="text-lg text-green-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            {error && <p className="text-red-500 font-semibold mb-4">{error}</p>}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              // Increase button size and padding
              className="w-full py-6 px-10 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 text-2xl"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="w-8 h-8 animate-spin mx-auto" />
              ) : (
                "Login"
              )}
            </motion.button>
          </form>
        </div>

        <div className="px-14 py-10 bg-gray-900 bg-opacity-50 flex justify-center">
          <p className="text-xl text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-green-400 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
