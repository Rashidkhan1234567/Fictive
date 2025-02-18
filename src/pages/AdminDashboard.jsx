import { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  where,
} from "firebase/firestore";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Moon,
  Sun,
  Menu,
  X,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "../Styles/AdminDashboard.css";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import EditModal from "../components/EditModal";
import OrderModal from "../components/OrderModal/OrderModal";
import UploadModal from "../components/UploadModal/UploadModal";
import { CONFIG } from "../utils/constants";

export default function AdminDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    cardId: null,
    cardTitle: "",
  });
  const [editModal, setEditModal] = useState({
    isOpen: false,
    card: null,
  });
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderCount, setOrderCount] = useState(0);

  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "cards"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCards(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
      setLoading(false);
    });

    const ordersQuery = query(
      collection(db, "orders"),
      where("status", "==", "pending") // Only count pending orders
    );

    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      setOrderCount(snapshot.docs.length);
    });

    return () => {
      unsubscribe();
      unsubscribeOrders();
    };
  }, []);

  useEffect(() => {
    // Admin email verification
    if (!CONFIG.ADMIN_EMAIL.includes(user?.emailAddresses[0]?.emailAddress)) {
      navigate('/');
      toast.error('Access denied. Admin privileges required.');
    }
  }, [user, navigate]);

  const handleDeleteClick = (card) => {
    setDeleteModal({
      isOpen: true,
      cardId: card.id,
      cardTitle: card.title,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteDoc(doc(db, "cards", deleteModal.cardId));
      toast.success("Product deleted successfully");
      setDeleteModal({ isOpen: false, cardId: null, cardTitle: "" });
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleEditClick = (card) => {
    setEditModal({
      isOpen: true,
      card: card,
    });
  };

  const handleCloseEditModal = () => {
    setEditModal({
      isOpen: false,
      card: null,
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark");
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const ImageSlider = ({ images }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = (e) => {
      e.stopPropagation();
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
      e.stopPropagation();
      setCurrentImageIndex(
        (prev) => (prev - 1 + images.length) % images.length
      );
    };

    return (
      <div className="product-image-slider">
        <img src={images[currentImageIndex]} alt="Product" />
        {images.length > 1 && (
          <>
            <button className="slider-btn prev" onClick={prevImage}>
              <ChevronLeft size={20} />
            </button>
            <button className="slider-btn next" onClick={nextImage}>
              <ChevronRight size={20} />
            </button>
            <div className="slider-dots">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${
                    index === currentImageIndex ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className={`admin-container ${darkMode ? "dark" : ""}`}>
      <header className="admin-header">
        <div className="header-content">
          <div className="admin-info">
            <h1>Welcome back, {user?.firstName}</h1>
            <p>Manage your products and view orders</p>
          </div>

          <div className="admin-actions">
            <button
              className="add-product-btn"
              onClick={() => setIsUploadModalOpen(true)} // Update this line
            >
              Add New Product
            </button>

            <button className="theme-toggle-btn" onClick={toggleDarkMode}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button onClick={handleSignOut} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        {loading ? (
          <div className="loading-grid">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="skeleton-card" />
            ))}
          </div>
        ) : (
          <motion.div
            className="products-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {cards.map((card) => (
              <motion.div
                key={card.id}
                className="admin-product-card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                layout
              >
                <div className="product-image-container">
                  <ImageSlider images={card.images} />
                  <div className="product-overlay">
                    <div className="action-buttons">
                      <button
                        onClick={() => handleEditClick(card)}
                        className="edit-btn"
                      >
                        <Edit size={18} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(card)}
                        className="delete-btn"
                      >
                        <Trash2 size={18} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                <div className="product-info">
                  <div className="product-header">
                    <h3>{card.title}</h3>
                  </div>

                  <div className="product-details">
                    <p className="product-description">{card.description}</p>
                    <div className="product-meta">
                      <span className="product-price">
                        {card.currency === "USD" ? "$" : card.currency}
                        {parseFloat(card.price).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      <motion.button
        className="orders-fab"
        onClick={() => setIsOrderModalOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ShoppingBag size={24} />
        {orderCount > 0 && (
          <motion.span
            className="orders-count"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            key={orderCount}
          >
            {orderCount}
          </motion.span>
        )}
      </motion.button>

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />

      <EditModal
        isOpen={editModal.isOpen}
        onClose={handleCloseEditModal}
        card={editModal.card}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, cardId: null, cardTitle: "" })
        }
        onConfirm={handleConfirmDelete}
        productName={deleteModal.cardTitle}
      />

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      {/* ...Modal components... */}
    </div>
  );
}
