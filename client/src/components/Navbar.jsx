import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation(); //this hook gets the information about the current location/url in the app.

  const isRegisterPage = location.pathname === "/"; //This checks if the current path is equal to '/' (the register/root path);
  const buttonText = user ? "Logout" : isRegisterPage ? "Login" : "Register";
//This variable is set based on whether the user is logged in and if the current page is the register page. If the user is logged in then the button is logout. If its the registerPage then the button is login, otherwise its register.
  return (
    <nav className="fixed top-0 left-0 right-0 bg-black w-full h-[8vh] flex text-white items-center z-50">
      <ul className="w-full flex items-center justify-between p-2">
        <li className="flex items-center space-x-4">
          <Link to={user ? "/hero" : "/login"} className="nav-link">
            <h2 className="p-5 text-[3vmin] hover:text-green-300 font-bold">Match Play</h2>
          </Link>
        </li>
        <li className="flex items-center space-x-4">
          {user && (
            <>
              <span className="nav-link text-[1.8vmin] sm:text-[2.2vmin]">
                Hi, {user}
              </span>

              <Link
                to="/profile"
                className="nav-link text-[1.8vmin] sm:text-[2.2vmin] hover:text-green-300"
              >
                Profile
              </Link>
              <Link
                to="/trending"
                className="nav-link text-[1.8vmin] sm:text-[2.2vmin] hover:text-green-300"
              >
                Trending
              </Link>
              <Link
                to="/chat"
                className="nav-link text-[1.8vmin] sm:text-[2.2vmin] hover:text-green-300"
              >
                Messages
              </Link>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 sm:px-4 rounded transition duration-300 ease-in-out text-[2.4vmin]"
              >
                {buttonText}
              </button>
            </>
          )}

          {!user && (
            <Link to={isRegisterPage ? "/login" : "/"}>
              <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-3 sm:px-4 rounded transition duration-300 ease-in-out text-[2.0vmin]">
                {buttonText}
              </button>
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
