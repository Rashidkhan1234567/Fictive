import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import ImageSlider from "../components/ImageSlider";
import Navbar from "../components/Navbar";
import ProductsSection from "../components/ProductsSection";
import ServicesSection from "../components/ServicesSection";
import ReviewsSection from "../components/ReviewsSection";
import { CONFIG } from "../utils/constants";
import "../Styles/Home.css"; // Import the main CSS file
import { useUser } from "@clerk/clerk-react";

const sliderImages = [
  {
    url: "https://res.cloudinary.com/dyuinsza5/image/upload/v1739095990/cex3mwx0tpcc83e2x9ai.webp",
    title: "Professional Business Cards",
    description: "High-quality business cards that make a lasting impression",
  },
  {
    url: "https://res.cloudinary.com/dyuinsza5/image/upload/v1739090313/rewkhm9bbvhm1d7w0otc.jpg",
    title: "Custom Banners & Signs",
    description: "Eye-catching banners for your business events and promotions",
  },
  {
    url: "https://res.cloudinary.com/dyuinsza5/image/upload/v1739090353/q61vxze7mh0ofqayflus.webp",
    title: "Marketing Materials",
    description: "Complete range of promotional materials for your brand",
  },
];

const Home = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

  useEffect(() => {
    if (
      isLoaded &&
      isSignedIn &&
      user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL
    ) {
      navigate("/admin");
    }
  }, [isLoaded, isSignedIn, user, navigate]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <ImageSlider slides={sliderImages} />

        {/* Hero Section */}
        <section className="hero-section">
          <h1>Digital Printing Solutions</h1>
          <p>
            Professional printing services for all your business needs. From
            business cards to banners, we deliver quality prints with fast
            turnaround times.
          </p>
        </section>

        {/* Sections */}
        <ProductsSection />
        <ServicesSection />
        <ReviewsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
