import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useCart } from "../CartContext";
import { GiHamburgerMenu } from "react-icons/gi";
// import MessageIcon from "@mui/icons-material/Message";
import PersonIcon from "@mui/icons-material/Person";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Badge from "@mui/material/Badge";
axios.defaults.withCredentials = true;

const Navbar = () => {
  const { user, logout, unreadCount } = useAuth();
  const { cartItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const location = useLocation();
  const isRegisterPage = location.pathname === "/";
  const buttonText = user ? "Logout" : isRegisterPage ? "Login" : "Register";
  const navigate = useNavigate();
  // const cartItemCount = cartItems.cart.reduce(
  //   (total, item) => total + item.quantity,
  //   0
  // );
  const cartItemCount =
    cartItems.cart?.reduce((total, item) => total + item.quantity, 0) || 0;

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuItemClick = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    let prevScrollPos = window.pageYOffset;
    let ticking = false;

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (currentScrollPos > prevScrollPos) {
            setScrolling(true);
          } else {
            setScrolling(false);
          }
          prevScrollPos = currentScrollPos;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const redirectToHome = () => {
    navigate("/hero");
  };

  return (
    <div className={`relative ${scrolling ? "hidden" : ""}`}>
      <nav className="fixed top-0 left-0 right-0 bg-black w-full h-[8vh] flex items-center justify-between text-white z-50 px-4">
        <div className="flex items-center space-x-4">
          <Link
            to={user ? "/hero" : "/login"}
            className="text-lg font-bold hover:text-green-300"
          >
            Match Play
          </Link>
        </div>

        <div className="lg:hidden">
          <GiHamburgerMenu
            className="cursor-pointer text-2xl"
            onClick={handleMenuToggle}
          />
        </div>

        <div
          className={`hidden lg:flex items-center space-x-4 ${
            user ? "" : "hidden"
          }`}
        >
          {user && (
            <>
              {/* <Link
                to="/chat"
                className="nav-link hover:text-green-300"
                onClick={handleMenuItemClick}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <MessageIcon alt="Chat" />
                </Badge>
              </Link> */}
              <Link
                to="/trending"
                className="nav-link hover:text-green-300"
                onClick={handleMenuItemClick}
              >
                <TrendingUpIcon alt="Trending" />
              </Link>
              <Link
                to="/location"
                className="nav-link hover:text-green-300"
                onClick={handleMenuItemClick}
              >
                <LocationOnIcon alt="Location" />
              </Link>
              <Link
                to="/profile"
                className="nav-link hover:text-green-300"
                onClick={handleMenuItemClick}
              >
                <PersonIcon alt="Profile" />
              </Link>
              <Link
                to="/store"
                className="nav-link text-white hover:text-green-300"
                onClick={handleMenuItemClick}
              >
                <LocalMallIcon sx={{ fontSize: 24, color: "white" }} />
              </Link>
              <Link
                to="/cart"
                className="nav-link text-white hover:text-green-300"
                onClick={handleMenuItemClick}
              >
                <Badge badgeContent={cartItemCount} color="error">
                  <ShoppingCartIcon sx={{ fontSize: 24, color: "white" }} />
                </Badge>
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
        className={`lg:hidden text-center fixed top-0 left-0 w-64 h-full bg-black text-white transform transition-transform ease-in-out overflow-y-auto z-50 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="text-2xl font-bold mb-4">
            {user ? (
              <span
                onClick={() => {
                  redirectToHome();
                  handleMenuItemClick();
                }}
                style={{ cursor: "pointer" }}
              >
                Hi, {user}
              </span>
            ) : (
              "Menu"
            )}
          </div>

          {user && (
            <>
              {/* <Link
                to="/chat"
                className="block py-3 hover:text-green-300"
                onClick={handleMenuItemClick}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <MessageIcon />
                </Badge>
              </Link> */}
              <Link
                to="/trending"
                className="block py-3 hover:text-green-300"
                onClick={handleMenuItemClick}
              >
                <TrendingUpIcon />
              </Link>
              <Link
                to="/location"
                className="block py-3 hover:text-green-300"
                onClick={handleMenuItemClick}
              >
                <LocationOnIcon alt="Location" />
              </Link>
              <Link
                to="/profile"
                className="block py-3 hover:text-green-300"
                onClick={handleMenuItemClick}
              >
                <PersonIcon />
              </Link>
              <Link
                to="/store"
                className="block py-3 text-white hover:text-green-300"
                onClick={handleMenuItemClick}
              >
                <LocalMallIcon />
              </Link>
              <Link
                to="/cart"
                className="block py-3 text-white hover:text-green-300 relative"
                onClick={handleMenuItemClick}
              >
                <Badge
                  badgeContent={cartItemCount}
                  color="error"
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <ShoppingCartIcon />
                </Badge>
              </Link>

              <button
                onClick={() => {
                  logout();
                  handleMenuItemClick();
                }}
                className="py-2 text-red-500 hover:text-red-600"
              >
                Logout
              </button>
            </>
          )}
          {!user && (
            <Link to={isRegisterPage ? "/login" : "/"}>
              <button
                className="block py-3 text-green-500 hover:text-green-600"
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
