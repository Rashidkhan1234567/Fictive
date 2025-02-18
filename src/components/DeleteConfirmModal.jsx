import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import "../Styles/components/DeleteConfirmModal.css";

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, productName }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="delete-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="delete-modal"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="delete-modal-content">
            <div className="delete-modal-header">
              <AlertTriangle className="warning-icon" />
              <h2>Delete Product</h2>
            </div>

            <div className="delete-modal-body">
              <p>
                Are you sure you want to delete{" "}
                <span className="highlighted-text">{productName}</span>? This
                action cannot be undone.
              </p>
            </div>

            <div className="delete-modal-footer">
              <button className="cancel-button" onClick={onClose}>
                Cancel
              </button>
              <button className="delete-button" onClick={onConfirm}>
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;
