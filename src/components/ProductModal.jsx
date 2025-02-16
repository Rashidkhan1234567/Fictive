import { useState } from "react";
import { useTheme } from "../context/ThemeProvider"; // Update this import based on your theme context location
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, ExternalLink } from "lucide-react";
import "../styles/components/ProductModal.css";

const ProductModal = ({ product, onClose, isOpen }) => {
  const { theme } = useTheme();
  const [selectedImage, setSelectedImage] = useState(0);

  if (!isOpen || !product) return null;

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const contentVariants = {
    hidden: { scale: 0.8, y: 50, opacity: 0 },
    visible: {
      scale: 1,
      y: 0,
      opacity: 1,
      transition: { type: "spring", duration: 0.5 },
    },
    exit: {
      scale: 0.8,
      y: 50,
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const imageVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="modal-overlay"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
        data-theme={theme} // Add theme attribute
      >
        <motion.div
          className={`modal-content ${theme === 'dark' ? 'dark-mode' : ''}`}
          variants={contentVariants}
          onClick={(e) => e.stopPropagation()}
          data-theme={theme} // Add theme attribute
        >
          <motion.button
            className="close-button"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
          >
            <X size={20} />
          </motion.button>

          <div className="modal-body">
            <div className="image-gallery">
              <motion.img
                key={selectedImage}
                src={product.images[selectedImage]}
                alt={product.title}
                className="main-image"
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.3 }}
              />
              <div className="thumbnail-list">
                {product.images.map((img, idx) => (
                  <motion.img
                    key={idx}
                    src={img}
                    alt={`${product.title} view ${idx + 1}`}
                    className={`thumbnail ${
                      selectedImage === idx ? "active" : ""
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(idx)}
                  />
                ))}
              </div>
            </div>

            <motion.div
              className="product-info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.h2
                className="product-title"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {product.title}
              </motion.h2>

              <motion.p
                className="product-category"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {product.category}
              </motion.p>

              <motion.p
                className="product-description"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {product.description}
              </motion.p>

              <motion.p
                className="product-price"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {product.currency} {product.price}
              </motion.p>

              <div className="action-buttons">
                <motion.button
                  className="details-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <ExternalLink size={20} />
                  <span>See Details</span>
                </motion.button>

                <motion.button
                  className="cart-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ShoppingCart size={20} />
                  <span>Add to Cart</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductModal;
