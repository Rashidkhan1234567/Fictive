import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, getDocs, setDoc, doc } from "firebase/firestore";
import { useUser, useAuth } from "@clerk/clerk-react";
import { ShoppingCart, X } from "lucide-react";
import { db } from "../firebase/firebaseConfig";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "sonner";
import "../Styles/Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const { user, isSignedIn } = useAuth();
  const [loading, setLoading] = useState(true);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, y: -20 },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    },
    hover: {
      y: -5,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    },
  };

  const modalVariants = {
    initial: { opacity: 0, x: -20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
      },
    },
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, "cards"));
        const snapshot = await getDocs(q);
        const productsData = snapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("Document data:", data);
          return {
            id: doc.id,
            title: data.title || "No Title",
            description: data.description || "No Description",
            price: data.price || 0,
            currency: data.currency || "AED",
            images: Array.isArray(data.images)
              ? data.images
              : [data.image || ""],
            ...data,
          };
        });
        console.log("All products:", productsData);
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handlePlaceOrder = async (product) => {
    try {
      if (!isSignedIn) {
        toast.error("Please sign in to place an order");
        return;
      }

      setIsOrdering(true);
      const orderId = `${user.id}_${product.id}_${Date.now()}`;

      const orderData = {
        orderId,
        userId: user.id,
        userEmail: user.emailAddresses[0]?.emailAddress || "",
        userName: user.fullName || "Anonymous",
        pfp: user.imageUrl || null,
        productId: product.id,
        productName: product.title,
        price: product.price || 0,
        currency: product.currency || "AED",
        images: product.images || [],
        orderedAt: new Date().toISOString(),
        status: "pending",
        productDescription: product.description || "",
      };

      const cleanOrderData = Object.fromEntries(
        Object.entries(orderData).filter(([_, v]) => v !== undefined)
      );

      await Promise.all([
        setDoc(doc(db, "orders", orderId), cleanOrderData),
        setDoc(doc(db, "users", user.id, "orders", orderId), cleanOrderData),
      ]);

      toast.success("Order placed successfully!");
      setHoveredProduct(null);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order");
    } finally {
      setIsOrdering(false);
    }
  };

  const calculateMouseDistance = (e, element) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  };

  const handleMouseMove = (e, element) => {
    const { x, y } = calculateMouseDistance(e, element);
    const centerX = element.offsetWidth / 2;
    const centerY = element.offsetHeight / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const handleMouseLeave = (element) => {
    element.style.transform =
      "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
  };

  return (
    <div className="app-wrapper">
      <Navbar />
      <motion.main
        className="products-container"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <section className="products-hero">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            Our Products
          </motion.h1>
          <div className="hero-glow"></div>
        </section>

        <motion.div className="products-grid" variants={pageVariants}>
          {loading ? (
            <div className="loading-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="product-skeleton" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="no-products">
              <h2>No products found</h2>
              <p>Please check back later</p>
            </div>
          ) : (
            products.map((product, index) => (
              <motion.div
                key={product.id}
                className="product-wrapper"
                variants={cardVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                custom={index}
                onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
                onMouseEnter={() => setHoveredProduct(product)}
              >
                <div className="product-card">
                  <div className="card-media">
                    <motion.img
                      src={product.images?.[0] || product.image}
                      alt={product.title}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300";
                      }}
                      layoutId={`image-${product.id}`}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="card-overlay"></div>
                  </div>

                  <div className="card-content">
                    <h2>{product.title}</h2>
                    <p>{product.description}</p>
                    <div className="price-badge">
                      {product.currency} {product.price}
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {hoveredProduct?.id === product.id && (
                    <motion.div
                      className="detail-modal"
                      variants={modalVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <div className="modal-gallery">
                        {product.images.map((img, idx) => (
                          <motion.div
                            key={idx}
                            className="gallery-item"
                            whileHover={{ scale: 1.05, z: 30 }}
                          >
                            <img
                              src={img}
                              alt={`${product.title} view ${idx + 1}`}
                            />
                          </motion.div>
                        ))}
                      </div>

                      <div className="modal-info">
                        <h3>{product.title}</h3>
                        <p>{product.description}</p>

                        <button
                          className="order-btn"
                          onClick={() => handlePlaceOrder(product)}
                          disabled={isOrdering}
                        >
                          {isOrdering ? (
                            <div className="spinner" />
                          ) : (
                            <>
                              <ShoppingCart />
                              <span>Place Order</span>
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </motion.div>
      </motion.main>
      <Footer />
    </div>
  );
}
