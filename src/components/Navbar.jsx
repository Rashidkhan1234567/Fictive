import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { ShoppingCart, Moon, Sun, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import "../Styles/components/Navbar.css";

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/services", label: "Services" },
    { path: "/contact", label: "Contact" },
  ];

  useEffect(() => {
    const theme = localStorage.getItem("theme") || "light";
    setIsDarkMode(theme === "dark");
    document.body.classList.toggle("dark", theme === "dark");
    document.body.classList.toggle("light", theme === "light");
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
    localStorage.setItem("theme", isDarkMode ? "light" : "dark");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <span className="logo-text">𝓕𝓲𝓬𝓽𝓲𝓿𝓮</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="desktop-nav">
          <div className="nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${
                  location.pathname === link.path ? "active" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop Actions & Mobile Nav Icons Combined */}
        <div className="nav-actions-group">
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <SignedIn>
            <Link to="/order" className="cart-link">
              <div className="cart-button">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="cart-counter">{cartCount}</span>
                )}
              </div>
            </Link>
            <UserButton
              appearance={{ elements: { avatarBox: "avatar-box" } }}
            />
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <button className="login-button">Login</button>
            </SignInButton>
          </SignedOut>

          {/* Mobile Menu Button - Only shows on mobile */}
          <button className="mobile-menu-btn" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? "show" : ""}`}>
          {/* Mobile Links */}
          <div className="mobile-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${
                  location.pathname === link.path ? "active" : ""
                }`}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Actions */}
          <div className="mobile-actions">
            <button className="theme-toggle" onClick={toggleTheme}>
              {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <SignedIn>
              <Link to="/order" className="cart-link" onClick={closeMenu}>
                <div className="cart-button">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="cart-counter">{cartCount}</span>
                  )}
                </div>
              </Link>
            </SignedIn>

            <SignedOut>
              <SignInButton>
                <button className="login-button">Login</button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
