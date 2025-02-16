import { createContext, useContext, useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const CartContext = createContext({
  cartCount: 0,
  setCartCount: () => {},
});

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(
        collection(db, "orders"),
        (snapshot) => {
          setCartCount(snapshot?.docs?.length || 0);
        },
        (error) => {
          console.error("Error fetching orders:", error);
          setCartCount(0);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up cart listener:", error);
      setCartCount(0);
    }
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    console.warn("useCart must be used within a CartProvider");
    return { cartCount: 0, setCartCount: () => {} };
  }
  return context;
};
