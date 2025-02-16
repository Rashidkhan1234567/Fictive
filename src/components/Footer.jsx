import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../Styles/components/Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="grid-row">
          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h4>Fictive</h4>
            <p>
              Your one-stop shop for all your digital printing, e-commerce, and
              advertising needs. We bring your ideas to life with high-quality
              prints and effective marketing solutions.
            </p>
          </motion.div>

          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/services">Services</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </motion.div>

          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h4>Services</h4>
            <ul>
              <li>Digital Printing</li>
              <li>E-commerce Solutions</li>
              <li>Advertising</li>
              <li>Graphic Design</li>
            </ul>
          </motion.div>

          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h4>Contact Us</h4>
            <ul>
              <li><span className="bold">Email :</span> fictiveprinting@gmail.com</li>
              <li><span className="bold">Phone :</span> +971 55 101 6255, 058 261 9893</li>
              <li><span className="bold">Address :</span> Al Shamsi Building Rm. 102, Port Saeed, Deira, Dubai, UAE</li>
            </ul>
          </motion.div>
        </div>

        <hr />

        <motion.div 
          className="footer-bottom"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <p>&copy; {currentYear} Fictive. All rights reserved.</p>
          <div className="links">
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
