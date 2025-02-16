import { motion } from "framer-motion";
import { Printer, CreditCard, Flag, ShoppingBag } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ServicesSection from "../components/ServicesSection";
import "../Styles/Services.css";
import { Link } from "react-router-dom";

const serviceHighlights = [
  {
    name: "Business Cards",
    icon: <CreditCard className="icon" />,
    description: "Premium business cards with custom finishes",
  },
  {
    name: "Custom Printing",
    icon: <Printer className="icon" />,
    description: "High-quality digital printing services",
  },
  {
    name: "Banners & Signs",
    icon: <Flag className="icon" />,
    description: "Eye-catching banners for events",
  },
  {
    name: "Merchandise",
    icon: <ShoppingBag className="icon" />,
    description: "Custom branded merchandise",
  },
];

export default function Services() {
  return (
    <div className="services-page">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hero-container"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hero-content"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.23, 1, 0.32, 1],
              delay: 0.2,
            }}
            className="hero-title"
          >
            Welcome to Our
            <span>Premium Services</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0.4,
            }}
            className="hero-description"
          >
            Transform your ideas into reality with our professional printing
            solutions. We bring creativity and precision to every project.
          </motion.p>
        </motion.div>

        {/* Service Highlights Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="highlights-grid"
        >
          {serviceHighlights.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                delay: 0.2 * index,
                duration: 0.5,
                ease: "easeOut",
              }}
              whileHover={{ scale: 1.02 }}
              className="highlight-card"
            >
              <motion.div
                className="highlight-icon-wrapper"
                whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                {service.icon}
              </motion.div>
              <h3 className="highlight-title">{service.name}</h3>
              <p className="highlight-description">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="decorative-line" />
      </motion.section>

      {/* Services Section Component */}
      <ServicesSection limit={14} />

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="cta-section"
      >
        <h2 className="cta-title">Ready to Get Started?</h2>
        <p className="cta-description">
          Contact us today for a free consultation and quote for your printing
          needs
        </p>
        <Link to="/contact">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cta-button"
          >
          Contact Us Now
        </motion.button>
            </Link>
      </motion.section>

      <Footer />
    </div>
  );
}
