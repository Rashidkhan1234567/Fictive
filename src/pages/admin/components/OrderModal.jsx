"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Package, Clock, CheckCircle } from "lucide-react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";

export default function OrderModal({ isOpen, onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const ordersQuery = query(
        collection(db, "orders"),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
        const ordersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersData);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-lg shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-purple-500" />
              Orders
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="h-[500px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin">
                  <Package className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            ) : orders.length > 0 ? (
              <div className="divide-y dark:divide-gray-700">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        Order #{order.id.slice(-6)}
                      </h3>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {/* Add more order details here */}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <Package className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No Orders Yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                  When customers place orders, they'll appear here for you to process and manage.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
