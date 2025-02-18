import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { ShoppingCart, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import "../Styles/components/Navbar.css";

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
    localStorage.setItem("theme", isDarkMode ? "light" : "dark");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Left - Logo */}
        <motion.div
          className="nav-logo"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/">
            <span className="logo-text">𝓕𝓲𝓬𝓽𝓲𝓿𝓮</span>
          </Link>
        </motion.div>

        {/* Center - Navigation Links */}
        <div className="nav-links">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.path}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <Link
                to={link.path}
                className={`nav-link ${
                  location.pathname === link.path ? "active" : ""
                }`}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Right - Actions */}
        <div className="nav-actions">
          <motion.button
            className="theme-toggle"
            onClick={toggleTheme}
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
          </motion.button>

          <SignedIn>
            <motion.div className="cart-wrapper" whileHover={{ scale: 1.1 }}>
              <Link to="/order" className="cart-button">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <motion.span
                    className="cart-counter"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>
            </motion.div>
            <UserButton
              appearance={{
                elements: { avatarBox: "avatar-box" },
              }}
            />
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <motion.button
                className="login-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
