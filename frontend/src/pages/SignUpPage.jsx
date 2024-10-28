import { useState } from "react";
import { motion } from "framer-motion";
import Input from "../components/Input";
import { User, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";
import { Loader } from "lucide-react";


const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { signup,error,isLoading } = useAuthStore();
  const handleSignUp = async (e) => {
    e.preventDefault();
    console.log("Form submitted with name:", name, "and email:", email);
  try {
    await signup(email, password, name);
    navigate("/verify-email")
  } catch (error) {
    console.log(error)
  }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-900 px-4"> 
      {/* px-4 adds padding to ensure it's not too tight on mobile */}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
        style={{ padding: '3rem', height: '650px' }} 
        // Adjusted width and set height for consistency
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-red-800 to-emerald-500 text-transparent bg-clip-text">
          Create Account
        </h2>

        <form onSubmit={handleSignUp}>
          <Input
            Icon={User}
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            Icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            Icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
{error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}

          <PasswordStrengthMeter password={password} />

          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
                font-bold rounded-lg shadow-lg hover:from-green-600
                hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
             {isLoading ? <Loader className=' animate-spin mx-auto' size={24} /> : "Sign Up"}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-green-400 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
