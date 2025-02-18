import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../Styles/Orders.css";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { ShoppingBag, CheckCircle2, Clock, Package } from "lucide-react"; // Added icons

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="orders-container">
      <Navbar />
      <motion.div
        className="orders-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="orders-header"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          <ShoppingBag className="header-icon" size={32} />
          <h1 className="orders-title">Your Orders</h1>
        </motion.div>

        {loading ? (
          <div className="skeleton-box" />
        ) : orders.length === 0 ? (
          <motion.div
            className="no-orders"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <Package size={48} />
            <h3>No Orders Yet</h3>
            <p>Your purchases will appear here</p>
          </motion.div>
        ) : isMobile ? (
          <div className="cards-container">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Tilt
                  className="order-card"
                  tiltMaxAngleX={5}
                  tiltMaxAngleY={5}
                  scale={1.02}
                >
                  <div className="card-content">
                    <div className="card-header">
                      <div className="user-info">
                        <img src={order.pfp} alt="" className="profile-pic" />
                        <h3 className="user-name">{order.userName}</h3>
                      </div>
                      <span className={`status-badge ${order.status}`}>
                        {order.status === "pending" ? (
                          <Clock className="status-icon" size={16} />
                        ) : (
                          <CheckCircle2 className="status-icon" size={16} />
                        )}
                        {order.status}
                      </span>
                    </div>
                    <div className="product-info">
                      <img
                        src={order.images[0]}
                        alt=""
                        className="product-img"
                      />
                      <div className="product-details">
                        <h4 className="product-name">{order.productName}</h4>
                        <span className="price">
                          {order.currency} {order.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="table-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Product Details</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    className={`table-row ${
                      index % 2 === 0 ? "row-even" : "row-odd"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <td>
                      <div className="product-info">
                        <img
                          src={order.images[0]}
                          alt=""
                          className="product-img"
                        />
                        <div className="info-group">
                          <h4 className="product-name">{order.productName}</h4>
                          <div className="user-info">
                            <img
                              src={order.pfp}
                              alt=""
                              className="profile-pic"
                            />
                            <span>{order.userName}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="price-cell">
                      {order.currency} {order.price}
                    </td>
                    <td>
                      <span className={`status-badge ${order.status}`}>
                        {order.status === "pending" ? (
                          <Clock className="status-icon" size={16} />
                        ) : (
                          <CheckCircle2 className="status-icon" size={16} />
                        )}
                        {order.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </motion.div>
      <Footer />
    </div>
  );
}
