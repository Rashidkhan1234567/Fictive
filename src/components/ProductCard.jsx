import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, ExternalLink, XCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react"; // Add useUser hook
import { setDoc, doc, writeBatch } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "../Styles/components/ProductCard.css";
import ErrorModal from "./ErrorModal";
import { toast } from "sonner"; // or your preferred toast library
import ProductModal from "./ProductModal"; // Add this import

const ProductCard = ({ product }) => {
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isOrdering, setIsOrdering] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const { userId, isSignedIn } = useAuth();
  const [theme, setTheme] = useState("light"); // Fixed: Initialize with proper useState
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Initial theme setup
    let theme = localStorage.getItem("theme") || "light";
    setTheme(theme);

    // Create MutationObserver to watch for theme changes
    const observer = new MutationObserver(() => {
      const newTheme = localStorage.getItem("theme") || "light";
      setTheme(newTheme);
    });

    // Watch for changes in localStorage
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const cards = document.getElementsByClassName("product-card");
      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleCardClick = (e) => {
    if (e.target.closest(".hover-actions")) {
      return;
    }
    setShowModal(true);
  };

  const handlePlaceOrder = async () => {
    if (!isSignedIn || !userId || !user) {
      toast.error("Please sign in to place an order");
      return;
    }

    try {
      setIsProcessingOrder(true);

      // Generate unique order ID
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const orderId = `order_${timestamp}_${randomString}`;

      const orderData = {
        orderId,
        userId: userId,
        userEmail: user.primaryEmailAddress?.emailAddress || "",
        userName: user.fullName || user.username || "Anonymous",
        pfp: user.imageUrl || null,
        productId: product.id || `prod_${timestamp}`,
        productName: product.title,
        price: product.price,
        currency: product.currency || "AED",
        images: product.images || [],
        orderedAt: new Date().toISOString(),
        status: "pending",
        productDescription: product.description,
      };

      const orderRef = doc(db, "orders", orderId);
      const userOrderRef = doc(db, `users/${userId}/orders`, orderId);

      const batch = writeBatch(db);
      batch.set(orderRef, orderData);
      batch.set(userOrderRef, orderData);

      await batch.commit();
      setShowModal(false);

      toast.success(`Order placed successfully! Order ID: ${orderId}`, {
        duration: 5000,
        position: "top-center",
      });
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again later.");
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const cardVariants = {
    hover: {
      rotateX: 2,
      rotateY: 2,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, backgroundColor: "rgba(0, 0, 0, 0)" },
    visible: {
      opacity: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      backgroundColor: "rgba(0, 0, 0, 0)",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const modalContentVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
    exit: { y: 50, opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
  };

  return (
    <>
      <motion.div
        className="product-card"
        variants={cardVariants}
        whileHover="hover"
        onHoverStart={() => !isMobile && setIsHovered(true)}
        onHoverEnd={() => !isMobile && setIsHovered(false)}
        onClick={handleCardClick}
        layout
      >
        <div className="card-image-container">
          <motion.img
            src={product.images[0]}
            alt={product.title}
            className="card-image"
          />
          <div className="card-overlay" />
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="hover-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <motion.button
                  className="action-icon"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart size={18} />
                </motion.button>
                <motion.button
                  className="action-icon"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ShoppingCart size={18} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="card-content">
          {product.isNew && (
            <motion.span
              className="card-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              New Arrival
            </motion.span>
          )}
          <h3 className="card-title">{product.title}</h3>
          <p className="card-description">{product.description}</p>
          <div className="card-footer">
            <div className="card-price">
              {product.currency} {product.price}
            </div>
            <div className="quick-actions">
              <motion.button
                className="view-details"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ExternalLink size={18} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        message="You need to sign in before placing an order."
      />
<div className="fix">
      <ProductModal
        product={product}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        />
        </div>
    </>
  );
};

export default ProductCard;
