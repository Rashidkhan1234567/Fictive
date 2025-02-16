import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      count: 0,
      addToCart: (product) => {
        set((state) => ({
          items: [...state.items, product],
          count: state.count + 1,
        }));
      },
      removeFromCart: (productId) => {
        set((state) => {
          const updatedItems = state.items.filter((item) => item.id !== productId);
          return {
            items: updatedItems,
            count: updatedItems.length,
          };
        });
      },
      clearCart: () => set({ items: [], count: 0 }),
    }),
    {
      name: "cart-storage",
      getStorage: () => localStorage, // Ensure persistence in Vite
    }
  )
);
