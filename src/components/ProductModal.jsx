import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import "../Styles/components/ProductCardModal.css";

const ProductModal = ({ product, onClose, isOpen }) => {

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [theme, setTheme] = useState("");
  const [direction, setDirection] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  setInterval(() => {
    const theme = localStorage.getItem("theme") || "light";
    setTheme(theme);
  }, 0);

  // Modified scroll lock handling for mobile
  useEffect(() => {
    if (!isOpen) return;

    const originalStyle = document.body.style.overflow;
    const isMobile = window.innerWidth <= 480;

    if (!isMobile) {
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = "0px";
    };
  }, [isOpen]);

  // Simplified close handler
  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    document.body.style.overflow = "auto";
    document.body.style.paddingRight = "0px";
    onClose();
  };

  // Handle escape key with useCallback
  const handleEscapeKey = useCallback(
    (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    },
    [isOpen, handleClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleEscapeKey);
    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    };
  }, [handleEscapeKey]);

  // Simplified overlay click handler
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const nextImage = () => {
    setDirection(1);
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setDirection(-1);
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const imageVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", duration: 0.5 },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 },
    },
  };

  const handleOrder = async () => {
    setIsLoading(true);
    try {
      // Simulating order process
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait" className="main">
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <motion.button
            className="modal-close"
            onClick={handleClose}
            aria-label="Close modal"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={24} />
          </motion.button>

          <motion.div
            className={`modal-content ${theme === "dark" ? "dark-mode" : "light-mode"}`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-grid">
              <div className="modal-image-section">
                <div className="image-container">
                  <AnimatePresence initial={false} custom={direction}>
                    <motion.img
                      key={currentImageIndex}
                      src={product.images[currentImageIndex]}
                      custom={direction}
                      variants={imageVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  </AnimatePresence>

                  {product.images.length > 1 && (
                    <>
                      <button className="nav-button prev" onClick={prevImage}>
                        <ChevronLeft />
                      </button>
                      <button className="nav-button next" onClick={nextImage}>
                        <ChevronRight />
                      </button>
                    </>
                  )}
                </div>

                <div className="image-thumbnails">
                  {product.images.map((img, idx) => (
                    <motion.div
                      key={idx}
                      className={`thumbnail ${
                        currentImageIndex === idx ? "active" : ""
                      }`}
                      onClick={() => setCurrentImageIndex(idx)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} />
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="modal-info">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {product.title}
                </motion.h2>

                <motion.p
                  className={`description ${theme == "dark" ? "dark-desp" : "light-desp"}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {product.description}
                </motion.p>

                <motion.div
                  className="price"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {product.currency} {product.price}
                </motion.div>

                <motion.button
                  className={`order-button ${isLoading ? "loading" : ""}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOrder}
                  disabled={isLoading}
                >
                  <ShoppingCart size={20} />
                  {isLoading ? "Processing..." : "Place Order"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
