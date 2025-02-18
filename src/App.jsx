import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import ErrorBoundary from "./components/ErrorBoundary";
import { CartProvider } from "./context/CartContext";
import { useEffect } from "react";
import ServicePage from "./pages/Services.jsx";
import ProductsPage from "./pages/Products.jsx";
import { ClerkProvider, useUser } from "@clerk/clerk-react";
import { Toaster } from "sonner";
import OrdersPage from "./pages/Order.jsx";
import AdminDashboard from "./pages/AdminDashboard";
import Contact from "./pages/Contact.jsx";

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

// Public Route Component
const PublicRoute = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // If user is signed in and is admin, redirect to admin dashboard
  if (isSignedIn && user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL) {
    return <Navigate to="/admin" />;
  }

  return children;
};

// Route Guard Component
const RouteGuard = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/" />;
  }

  // If user is admin, redirect to admin dashboard
  if (user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL) {
    return <Navigate to="/admin" />;
  }

  return children;
};

// Protected Admin Route Component
const ProtectedAdminRoute = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/" />;
  }

  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

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
                {/* Public Route */}
                <Route
                  path="/"
                  element={
                    <PublicRoute>
                      <Home />
                    </PublicRoute>
                  }
                />

                {/* Protected Routes */}
                <Route
                  path="/services"
                  element={
                    <RouteGuard>
                      <ServicePage />
                    </RouteGuard>
                  }
                />
                <Route
                  path="/products"
                  element={
                    <RouteGuard>
                      <ProductsPage />
                    </RouteGuard>
                  }
                />
                <Route
                  path="/order"
                  element={
                    <RouteGuard>
                      <OrdersPage />
                    </RouteGuard>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <RouteGuard>
                      <Contact />
                    </RouteGuard>
                  }
                />

                {/* Admin Route */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedAdminRoute>
                      <AdminDashboard />
                    </ProtectedAdminRoute>
                  }
                />

                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </ClerkProvider>
        </CartProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
