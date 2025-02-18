import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ErrorBoundary from "./components/ErrorBoundary";
import { CartProvider } from "./context/CartContext";
import { useEffect } from "react";
import ServicePage from "./pages/Services.jsx";
import ProductsPage from "./pages/Products.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { Toaster } from "sonner";
import OrdersPage from "./pages/Order.jsx";

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  useEffect(() => {
    const theme = localStorage.getItem("theme") || "light";
    document.body.classList.add(theme);
  }, []);

  return (
    <div className="app">
      <ErrorBoundary>
        <CartProvider>
          <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
            <Toaster
              position="top-center"
              expand={false}
              richColors
              closeButton
            />
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<ServicePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/order" element={<OrdersPage />} />
              </Routes>
            </Router>
          </ClerkProvider>
        </CartProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
