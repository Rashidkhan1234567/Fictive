import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, ExternalLink, XCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "../Styles/components/ProductCard.css";
import ErrorModal from "./ErrorModal";
import { toast } from "sonner"; // or your preferred toast library
import SuccessModal from "./SuccessModal";

const ProductCard = ({ product }) => {
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isOrdering, setIsOrdering] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { user, isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
    try {
      if (!isSignedIn) {
        setShowErrorModal(true);
        return;
      }

      setIsOrdering(true);
      const orderId = `${user.id}_${product.id}_${Date.now()}`;

      const orderData = {
        orderId,
        userId: user.id,
        userEmail: user.emailAddresses[0]?.emailAddress || "",
        userName: user.fullName || "Anonymous",
        pfp: user.imageUrl || null,
        productId: product.id,
        productName: product.title,
        price: product.price || 0,
        currency: product.currency || "AED",
        images: product.images || [],
        orderedAt: new Date().toISOString(),
        status: "pending",
        productDescription: product.description || "",
      };

      const cleanOrderData = Object.fromEntries(
        Object.entries(orderData).filter(([_, v]) => v !== undefined)
      );

      await Promise.all([
        setDoc(doc(db, "orders", orderId), cleanOrderData),
        setDoc(doc(db, "users", user.id, "orders", orderId), cleanOrderData),
      ]);

      setShowSuccessModal(true);
      setShowModal(false);

      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsOrdering(false);
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
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.15 },
    },
  };

  const modalContentVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.2, delay: 0.1 },
    },
    exit: {
      y: 20,
      opacity: 0,
      transition: { duration: 0.15 },
    },
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

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-backdrop"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="preview-modal"
              variants={modalContentVariants}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-modal"
                onClick={() => setShowModal(false)}
                aria-label="Close modal"
              >
                <XCircle size={20} />
              </button>

              <div className="modal-content">
                <div className="modal-image-section">
                  <motion.img
                    src={product.images[currentImageIndex]}
                    alt={product.title}
                    className="main-preview-image"
                    layoutId={`product-image-${product.id}`}
                  />

                  {product.images.length > 1 && (
                    <div className="image-thumbnails">
                      {product.images.map((img, idx) => (
                        <motion.img
                          key={idx}
                          src={img}
                          alt={`${product.title} view ${idx + 1}`}
                          className={`thumbnail ${
                            currentImageIndex === idx ? "active" : ""
                          }`}
                          onClick={() => setCurrentImageIndex(idx)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="modal-info">
                  <motion.h2
                    className="card-title"
                    layoutId={`title-${product.id}`}
                  >
                    {product.title}
                  </motion.h2>
                  <p className="modal-description">{product.description}</p>
                  <motion.div
                    className="modal-price"
                    layoutId={`price-${product.id}`}
                  >
                    {product.currency} {product.price}
                  </motion.div>

                  <div className="modal-actions">
                    <button
                      className="order-btn"
                      onClick={handlePlaceOrder}
                      disabled={isOrdering}
                    >
                      {isOrdering ? (
                        <div className="loading-spinner" />
                      ) : (
                        <>
                          <ShoppingCart size={18} />
                          Place Order
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="Order placed successfully!"
      />
    </>
  );
};

export default ProductCard;
