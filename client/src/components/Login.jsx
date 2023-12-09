import React from "react";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmail("");
    setPassword("");

    const form_data = {
      email,
      password,
    };
    try {
      const login_user = await axios.post("/user/login", form_data);

      if (login_user.status === 200) {
        setUser(login_user.data.firstName);

        navigate("/hero");
      }
    } catch (error) {
      console.error("Login Error:", error);
      window.alert(
        error.response?.data?.errorMessage || "An error occurred during login."
      );
    }
  };
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="bg-white p-12 rounded shadow-lg">
        <h1 className="w-full h-full font-bold text-[4vmin] p-5">Login</h1>
        <form onSubmit={handleSubmit} className="h-full">
          <div className="p-5 border-b text-black">
            <input
              className="w-full border-b rounded-lg py-2 px-3 focus:outline-none focus:border-green-500"
              type="email"
              placeholder="Email..."
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>
          <div className="p-5 border-b text-black flex">
            <div>
              <input
                className="w-full border-b rounded-lg py-2 px-3 focus:outline-none focus:border-green-500"
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
                    className="ml-2"
                  />
                </label>
                show password
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
                className="text-blue-500 hover:underline"
              >
                Forgot Password?
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
