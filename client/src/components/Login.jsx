import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import VideoBackground from "./VideoBackground";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [zoomEffect, setZoomEffect] = useState(false); // New state for controlling the zoom effect
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form_data = {
      email,
      password,
    };
    try {
      const login_user = await axios.post("/user/login", form_data);
      if (login_user.status === 200) {
        setUser(login_user.data.firstName);
        setZoomEffect(true); // Trigger the zoom effect upon successful login
        setTimeout(() => {
          navigate("/hero");
        }, 800); // Delay the navigation to allow the zoom effect to complete
      }
    } catch (error) {
      console.error("Login Error:", error);
      window.alert(
        error.response?.data?.errorMessage || "An error occurred during login."
      );
    }
  };

  return (
    <div className={`relative w-full min-h-screen ${zoomEffect ? 'scale-125 transition-transform duration-700 ease-in-out' : ''}`}>
      <VideoBackground />

      <div className={`absolute top-0 left-0 w-full h-full flex items-center justify-center ${zoomEffect ? 'opacity-0 transition-opacity duration-700 ease-in-out' : 'transition-opacity duration-500 ease-in-out'}`}>
        <div className="bg-transparent p-12 rounded shadow-lg">
          <h1 className="w-full h-full font-bold text-white text-[4vmin] p-5">Login</h1>
          <form onSubmit={handleSubmit} className="h-full">
            <div className="p-5 text-black">
              <input
                className="w-full rounded-lg py-2 px-3 focus:border-green-500"
                type="email"
                placeholder="Email..."
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>
            <div className="p-5 text-black flex">
              <div>
                <input
                  className="w-full rounded-lg py-2 px-3 focus:border-green-500"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password..."
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                />
                <div>
                  <label className="w-full p-2">
                    <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                      className="ml-2 mt-4"
                    />
                    show password
                  </label>
                </div>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white w-full font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-green active:bg-green-700 ml-2"
              >
                Login
              </button>
            </div>
            <div className="text-sm p-5">
              <p className="mb-2">
                <Link
                  to="/forgotpassword"
                  className="text-blue-800 text-sm font-bold hover:underline"
                >
                  Forgot Password?
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
