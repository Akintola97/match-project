import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { GiHamburgerMenu } from "react-icons/gi";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const isRegisterPage = location.pathname === "/";
  const buttonText = user ? "Logout" : isRegisterPage ? "Login" : "Register";

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuItemClick = () => {
    setMenuOpen(false);
  };

  return (
    <div className="relative">
      <nav className="fixed top-0 left-0 right-0 bg-black w-full h-16 flex items-center justify-between text-white z-50 px-4">
        <div className="flex items-center space-x-4">
          <Link to={user ? "/hero" : "/login"} className="text-lg font-bold hover:text-green-300">
            Match Play
          </Link>
        </div>

        <div className="lg:hidden">
          <GiHamburgerMenu
            className="cursor-pointer text-2xl"
            onClick={handleMenuToggle}
          />
        </div>

        <div className={`hidden lg:flex items-center space-x-4 ${user ? '' : 'hidden'}`}>
          {user && (
            <>
            <NotificationsNoneIcon />
              <Link to="/profile" className="nav-link hover:text-green-300" onClick={handleMenuItemClick}>
                Profile
              </Link>
              <Link to="/trending" className="nav-link hover:text-green-300" onClick={handleMenuItemClick}>
                Trending
              </Link>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded transition duration-300 ease-in-out text-sm"
              >
                {buttonText}
              </button>
            </>
          )}

          {!user && (
            <Link to={isRegisterPage ? "/login" : "/"}>
              <button
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded transition duration-300 ease-in-out text-sm"
                onClick={handleMenuItemClick}
              >
                {buttonText}
              </button>
            </Link>
          )}
        </div>
      </nav>

      {menuOpen && (
        <div
          className="fixed top-0 left-0 bottom-0 w-full bg-black bg-opacity-75 z-40"
          onClick={handleMenuToggle}
        />
      )}

      <div
        className={`lg:hidden fixed top-0 left-0 w-64 h-full bg-black text-white transform transition-transform ease-in-out overflow-y-auto z-50 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="text-2xl font-bold mb-4">{user ? `Hi, ${user}` : "Menu"}</div>
          {user && (
            <>
              <Link
                to="/profile"
                className="block py-2 hover:text-green-300"
                onClick={handleMenuItemClick}
              >
                Profile
              </Link>
              <Link
                to="/trending"
                className="block py-2 hover:text-green-300"
                onClick={handleMenuItemClick}
              >
                Trending
              </Link>
              <button
                onClick={() => {
                  logout();
                  handleMenuItemClick();
                }}
                className="block py-2 text-red-500 hover:text-red-600"
              >
                Logout
              </button>
            </>
          )}
          {!user && (
            <Link to={isRegisterPage ? "/login" : "/"}>
              <button
                className="block py-2 text-green-500 hover:text-green-600"
                onClick={handleMenuItemClick}
              >
                {buttonText}
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
