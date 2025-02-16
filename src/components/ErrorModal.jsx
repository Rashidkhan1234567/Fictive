import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle } from "lucide-react";
import "../Styles/components/ErrorModal.css";

const ErrorModal = ({ isOpen, onClose, message }) => {
  const modalVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="error-modal-overlay"
          onClick={onClose}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
            exit: { opacity: 0 },
          }}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="error-modal"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="error-modal-header">
              <XCircle className="error-icon" />
              <h2 className="error-modal-title">Error</h2>
            </div>
            <div className="error-modal-body">
              <p className="error-modal-message">{message}</p>
            </div>
            <div className="error-modal-footer">
              <button className="error-modal-close-btn" onClick={onClose}>
                Okay
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ErrorModal;
