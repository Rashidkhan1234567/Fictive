import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Package, Clock, User } from "lucide-react";
import {
  collection,
  getDocs,
  query,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { toast } from "sonner";
import "./OrderModal.css";

export default function OrderModal({ isOpen, onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  // Get filtered orders based on active category
  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "all") return true;
    return order.status === activeFilter;
  });

  const orderStats = {
    all: orders.length,
    pending: orders.filter((order) => order.status === "pending").length,
    approved: orders.filter((order) => order.status === "approved").length,
    rejected: orders.filter((order) => order.status === "rejected").length,
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "orders"));
      const ordersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched orders:", ordersData);
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  const handleStatusChange = async (orderId, newStatus) => {
    setProcessingId(orderId);
    try {
      if (newStatus === "rejected") {
        await deleteDoc(doc(db, "orders", orderId));
        setOrders((prev) => prev.filter((order) => order.id !== orderId));
        toast.success("Order rejected and removed");
      } else {
        await updateDoc(doc(db, "orders", orderId), {
          status: newStatus,
          updatedAt: new Date(),
        });
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
        toast.success(`Order ${newStatus} successfully`);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order status");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="order-modal-overlay">
          <motion.div
            className="order-modal"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <div className="orders-layout">
              {/* Header with close button */}
              <div className="modal-header">
                <h2>Orders</h2>
                <button onClick={onClose} className="modal-close-btn">
                  <X size={20} />
                </button>
              </div>

              {/* Stats Section - Simplified for mobile */}
              <div className="orders-stats">
                <div className="stat-card">
                  <h3>Pending</h3>
                  <span className="stat-value pending">
                    {orderStats.pending}
                  </span>
                </div>
                <div className="stat-card">
                  <h3>Approved</h3>
                  <span className="stat-value approved">
                    {orderStats.approved}
                  </span>
                </div>
              </div>

              {/* Filter Pills - Horizontal scrollable */}
              <div className="filter-scroll">
                <button
                  className={`filter-pill ${
                    activeFilter === "all" ? "active" : ""
                  }`}
                  onClick={() => setActiveFilter("all")}
                >
                  All
                </button>
                <button
                  className={`filter-pill ${
                    activeFilter === "pending" ? "active" : ""
                  }`}
                  onClick={() => setActiveFilter("pending")}
                >
                  Pending
                </button>
                <button
                  className={`filter-pill ${
                    activeFilter === "approved" ? "active" : ""
                  }`}
                  onClick={() => setActiveFilter("approved")}
                >
                  Approved
                </button>
              </div>

              {/* Orders Content */}
              <div className="orders-content">
                {loading ? (
                  <div className="loading-state">
                    <div className="loading-pulse" />
                  </div>
                ) : filteredOrders.length > 0 ? (
                  <div className="orders-grid">
                    {filteredOrders.map((order) => (
                      <div key={order.orderId} className="order-card">
                        <div className="order-card-header">
                          <img src={order.pfp} alt="" className="user-avatar" />
                          <div className="order-info">
                            <h3>{order.userName}</h3>
                            <span className="order-id">
                              #{order.orderId.slice(-6)}
                            </span>
                          </div>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.orderId, e.target.value)
                            }
                            className={`status-select ${order.status}`}
                            disabled={processingId === order.orderId}
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Reject</option>
                          </select>
                        </div>

                        <div className="order-product">
                          <img
                            src={order.images[0]}
                            alt=""
                            className="product-image"
                          />
                          <div className="product-details">
                            <h4>{order.productName}</h4>
                            <span className="price">
                              {order.currency} {order.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <Package size={48} />
                    <p>No orders found</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
