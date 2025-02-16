"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  productName,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 z-50"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Confirm Deletion
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-medium text-red-600 dark:text-red-400">
                  {productName}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
