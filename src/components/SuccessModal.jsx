import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

const SuccessModal = ({ isOpen, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ pointerEvents: "auto" }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-2xl flex flex-col items-center max-w-md mx-4"
            initial={{ scale: 0.5, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 100 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <motion.div
              className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
            </motion.div>
            <motion.h2
              className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Order Placed Successfully!
            </motion.h2>
            <motion.p
              className="text-gray-600 dark:text-gray-300 text-center text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {message || "We'll contact you soon to confirm your order."}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;
