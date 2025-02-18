import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, query,  getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { ChevronRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import ProductCard from "./ProductCard";
import "../Styles/components/ProductsSection.css";

const LoadingSkeleton = () => (
  <div className="products-grid">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="product-card-skeleton">
        <div className="image-skeleton skeleton" />
        <div className="content-skeleton">
          <div className="title-skeleton skeleton" />
          <div className="text-skeleton skeleton" />
          <div className="price-skeleton skeleton" />
        </div>
      </div>
    ))}
  </div>
);

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, "cards"));
        const snapshot = await getDocs(q);
        const productsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Show only first 12 products instead of 8
  const displayedProducts = products.slice(0, 12);
  const hasMoreProducts = products.length > 12;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <section className="products-section">
      <motion.div
        className="section-header"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="section-badge">Featured Products</span>
        <h2 className="section-title">Our Collection</h2>
        <p className="section-description">
          Discover our exclusive range of high-quality printing solutions
        </p>
      </motion.div>
      <div className="products-grid">
        <motion.div
          className="grid-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {displayedProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="product-card-wrapper"
            >
              <ProductCard
                product={product}
                onAddToCart={() => addToCart(product)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {hasMoreProducts && (
        <motion.div
          className="more-products"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.a
            href="/products"
            className="view-all-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>View All Products</span>
            <ChevronRight />
          </motion.a>
          <p className="remaining-count">
            Discover {products.length - 12} more products
          </p>
        </motion.div>
      )}
    </section>
  );
};

export default ProductsSection;
