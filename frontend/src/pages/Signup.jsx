import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { register } from '../services/authService';

const Signup = () => {
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: ""
  });

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!signupData.email || !signupData.password || !signupData.name) {
      alert("Please fill all the fields");
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const payload = {
      name: signupData.name,
      email: signupData.email,
      password: signupData.password
    };

    try {
      const response = await register(payload);
      if (response.status === 201) {
        alert("Signup successful! Redirecting to login page.");
        navigate("/");
      } else {
        alert("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred during signup. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center pt-8 pb-12 px-4">
      {/* Header / Logo */}
      <div className="mb-8 cursor-pointer" onClick={() => navigate("/")}>
        <h1 className="text-3xl font-black tracking-tighter">Spotify<span className="text-green-500">®</span></h1>
      </div>

      <div className="w-full max-w-[450px]">
        <h2 className="text-3xl font-bold text-center mb-10 tracking-tight">
          Sign up for free to start listening.
        </h2>

        <form onSubmit={handleSignup} className="flex flex-col gap-5">
          {/* Name Field */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold" htmlFor="name">What's your name?</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your profile name"
              value={signupData.name}
              onChange={handleOnChange}
              className="p-3 bg-[#121212] border border-gray-500 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 hover:border-white transition-all"
            />
          </div>

          {/* Email Field */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold" htmlFor="email">What's your email?</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={signupData.email}
              onChange={handleOnChange}
              className="p-3 bg-[#121212] border border-gray-500 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 hover:border-white transition-all"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold" htmlFor="password">Create a password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={signupData.password}
              onChange={handleOnChange}
              className="p-3 bg-[#121212] border border-gray-500 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 hover:border-white transition-all"
            />
          </div>

          {/* Confirm Password Field */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold" htmlFor="confirmPassword">Confirm your password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Enter your password again"
              value={signupData.confirmPassword}
              onChange={handleOnChange}
              className="p-3 bg-[#121212] border border-gray-500 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 hover:border-white transition-all"
            />
          </div>

          <div className="text-xs text-gray-400 mt-2">
            By clicking on sign-up, you agree to Spotify's <span className="underline text-green-500 cursor-pointer">Terms and Conditions</span>.
          </div>

          <div className="flex justify-center mt-4">
            <button 
              type="submit"
              className="bg-[#1ED760] text-black font-extrabold py-4 px-12 rounded-full hover:scale-105 transition-transform duration-200 active:scale-95 w-full sm:w-auto"
            >
              Sign up
            </button>
          </div>
        </form>

        <div className="flex flex-col items-center mt-8 pt-8 border-t border-[#282828]">
          <p className="font-bold text-gray-400">
            Have an account? <span 
              className="text-white underline cursor-pointer hover:text-green-500 transition-colors" 
              onClick={() => navigate("/login")}
            >
              Log in
            </span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;