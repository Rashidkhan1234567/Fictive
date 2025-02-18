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
        <motion.div
          className="order-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="order-modal"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="orders-layout">
              {/* Stats Section */}
              <div className="orders-stats">
                <div className="stat-card">
                  <h3>Total Orders</h3>
                  <span className="stat-value">{orderStats.all}</span>
                </div>
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

              {/* Filter Buttons */}
              <div className="filter-container">
                <div className="filter-buttons">
                  <button
                    className={`filter-btn ${
                      activeFilter === "all" ? "active" : ""
                    }`}
                    onClick={() => setActiveFilter("all")}
                  >
                    All ({orderStats.all})
                  </button>
                  <button
                    className={`filter-btn ${
                      activeFilter === "pending" ? "active" : ""
                    }`}
                    onClick={() => setActiveFilter("pending")}
                  >
                    Pending ({orderStats.pending})
                  </button>
                  <button
                    className={`filter-btn ${
                      activeFilter === "approved" ? "active" : ""
                    }`}
                    onClick={() => setActiveFilter("approved")}
                  >
                    Approved ({orderStats.approved})
                  </button>
                  <button
                    className={`filter-btn ${
                      activeFilter === "rejected" ? "active" : ""
                    }`}
                    onClick={() => setActiveFilter("rejected")}
                  >
                    Rejected ({orderStats.rejected})
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="orders-content">
                {loading ? (
                  <div className="loading-state">
                    <div className="loading-pulse"></div>
                    <span>Loading orders...</span>
                  </div>
                ) : filteredOrders.length > 0 ? (
                  <div className="scrollable-wrapper">
                    <div className="table-wrapper">
                      <table>
                        <thead>
                          <tr>
                            <th>CUSTOMER</th>
                            <th>PRODUCT</th>
                            <th>ORDER DETAILS</th>
                            <th>STATUS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrders.map((order) => (
                            <tr
                              key={order.orderId}
                              className={
                                processingId === order.orderId
                                  ? "processing"
                                  : ""
                              }
                            >
                              <td>
                                <div className="customer-info">
                                  <img
                                    src={order.pfp}
                                    alt={order.userName}
                                    className="user-avatar"
                                  />
                                  <div className="user-details">
                                    <span className="user-name">
                                      {order.userName}
                                    </span>
                                    <span className="user-email">
                                      {order.userEmail}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="product-info">
                                  <img
                                    src={order.images[0]}
                                    alt={order.productName}
                                    className="product-image"
                                  />
                                  <div className="product-details">
                                    <div className="product-name">
                                      {order.productName}
                                    </div>
                                    <div className="product-description">
                                      {order.productDescription}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="order-details">
                                  <div className="order-id">
                                    #{order.orderId.slice(-6)}
                                  </div>
                                  <div className="order-date">
                                    {new Date(
                                      order.orderedAt
                                    ).toLocaleDateString("en-US", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </div>
                                  <div className="order-price">
                                    {order.currency}{" "}
                                    {order.price.toLocaleString()}
                                  </div>
                                </div>
                              </td>
                              <td>
                                {processingId === order.orderId ? (
                                  <div className="loading-dots">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                  </div>
                                ) : (
                                  <select
                                    value={order.status}
                                    onChange={(e) =>
                                      handleStatusChange(
                                        order.orderId,
                                        e.target.value
                                      )
                                    }
                                    className={`status-select ${order.status}`}
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                  </select>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-illustration">
                      <Package size={64} />
                    </div>
                    <h3>
                      No {activeFilter !== "all" ? activeFilter : ""} orders
                      found
                    </h3>
                    <p>No orders match the selected filter</p>
                  </div>
                )}
              </div>

              {/* Quick Actions Footer */}
              <div className="orders-footer">
                <div className="selected-count">
                  {orders.length} orders total
                </div>
                <div className="quick-actions">
                  <button className="action-btn">Export CSV</button>
                  <button className="action-btn primary">Bulk Update</button>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="modal-close-btn">
              <X size={24} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
