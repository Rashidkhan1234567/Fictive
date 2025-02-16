import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ErrorBoundary from "./components/ErrorBoundary";
import { CartProvider } from "./context/CartContext";
import { useEffect } from "react";
import ServicePage from "./pages/Services.jsx";
import ProductsPage from "./pages/Products.jsx";

function App() {
  useEffect(() => {
    const theme = localStorage.getItem("theme") || "light";
    document.body.classList.add(theme);
  }, []);

  return (
    <div className="app">
      <ErrorBoundary>
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<ServicePage />} />
              <Route path="/products" element={<ProductsPage />} />

            </Routes>
          </Router>
        </CartProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
