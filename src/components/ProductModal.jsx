import React, { useState, useEffect } from "react";
import { Modal, Carousel, Button } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useTheme } from "../context/ThemeProvider";
import "../Styles/components/ProductCardModal.css";

const ProductCardModal = ({ product, onClose, isOpen }) => {
  const { theme } = useTheme();
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!product) return null;

  const handleImageChange = (current) => {
    setCurrentImage(current);
  };

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const contentVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
    exit: { scale: 0.9, opacity: 0, transition: { duration: 0.3 } },
  };

  const imageVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const productInfoVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.5 } },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      backgroundColor: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
    },
    tap: { scale: 0.95 },
  };

  return (
    <Modal
      title={null}
      visible={isOpen}
      onCancel={onClose}
      footer={null}
      closeIcon={null}
      bodyStyle={{ padding: 0 }}
      width="80%"
      style={{ top: 20 }}
      modalRender={(modal) => (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="product-card-modal-overlay"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={onClose}
            >
              <motion.div
                className={`product-card-modal-content ${
                  theme === "dark" ? "dark-mode" : ""
                }`}
                variants={contentVariants}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="product-image-section">
                  {product.images.length > 1 ? (
                    <Carousel
                      autoplay
                      dots={true}
                      afterChange={handleImageChange}
                    >
                      {product.images.map((img, index) => (
                        <motion.img
                          key={index}
                          src={img}
                          alt={`${product.title} - Image ${index + 1}`}
                          className="product-image"
                          variants={imageVariants}
                          initial="hidden"
                          animate="visible"
                        />
                      ))}
                    </Carousel>
                  ) : (
                    <motion.img
                      src={product.images[0]}
                      alt={product.title}
                      className="product-image"
                      variants={imageVariants}
                      initial="hidden"
                      animate="visible"
                    />
                  )}
                </div>

                <motion.div
                  className="product-info-section"
                  variants={productInfoVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <h2 className="product-title">{product.title}</h2>
                  <p className="product-description">{product.description}</p>
                  <p className="product-price">
                    {product.currency} {product.price}
                  </p>
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    className="place-order-button"
                    onClick={() => {
                      alert("Order placed!");
                      onClose();
                    }}
                  >
                    Place Order
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    />
  );
};

export default ProductCardModal;
