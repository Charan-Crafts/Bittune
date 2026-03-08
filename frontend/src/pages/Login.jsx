import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { login as loginService } from "../services/authService"
import { useAuth } from '../context/Auth.context';
const Login = () => {

  const navigate = useNavigate();

  const {login} = useAuth()

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const handleOnChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      alert("Please fill all the fields");
      return;
    }
    loginService(loginData).then((res)=>{
      console.log(res)
      if(res.status === 200){
        alert("Login successful")
        localStorage.setItem("token",res.data.token)
        login(res.data.data,res.data.token)
        console.log(res.data.data.role)
        if(res.data.data.role === "admin"){
          navigate("/admin/albums")
        }else{
          navigate("/")
        }
      }
    }).catch((err)=>{
      console.log(err.response)
      setLoginData({
        email:"",
        password:""
      })
      alert(err.response.data.message)
    })
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      {/* Spotify Logo Placeholder */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Spotify<span className="text-green-500">®</span></h1>
      </div>

      <div className="w-full max-w-md bg-[#121212] p-10 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-8">Log in to continue</h2>
        
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="text-sm font-semibold">Email address</label>
            <input 
              type="email" 
              name="email"
              placeholder="Email address"
              value={loginData.email} 
              onChange={handleOnChange} 
              className="w-full p-3 bg-[#242424] border border-gray-500 rounded hover:border-white focus:outline-none focus:ring-2 focus:ring-green-500 text-white transition duration-200"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="password" className="text-sm font-semibold">Password</label>
            <input 
              type="password" 
              name="password"
              placeholder="Password"
              value={loginData.password} 
              onChange={handleOnChange} 
              className="w-full p-3 bg-[#242424] border border-gray-500 rounded hover:border-white focus:outline-none focus:ring-2 focus:ring-green-500 text-white transition duration-200"
            />
          </div>

          <button className="w-full py-3 mt-4 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition duration-300 transform hover:scale-105 active:scale-95">
            LOG IN
          </button>
        </form>

        <div className="mt-8 border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-400">Don't have an account?</p>
          <button className="mt-4 text-white font-bold hover:text-green-500 transition border-b border-transparent hover:border-green-500" onClick={()=>{
            return navigate("/register");
          }}>
            SIGN UP FOR SPOTIFY
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;