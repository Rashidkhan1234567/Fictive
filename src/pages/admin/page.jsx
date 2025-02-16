"use client";

import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import { Sun, Moon, Menu, X, ShoppingBag } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useToast } from "../../hooks/use-toast";
import UploadModal from "./components/UploadModal";
import EditModal from "./components/EditModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import OrderModal from "./components/OrderModal";
import ProductCard from "../../components/ui/ProductCard";
import { CONFIG } from "../../utils/constants";

export default function AdminDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, cardId: null, cardTitle: "" });
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isSignedIn || user?.primaryEmailAddress?.emailAddress !== CONFIG.ADMIN_EMAIL) {
      router.push("/");
    }
  }, [isSignedIn, user, router]);

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening");
  }, []);

  useEffect(() => {
    const cardsQuery = query(collection(db, "cards"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(cardsQuery, (snapshot) => {
      setCards(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching cards:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const confirmDelete = async () => {
    if (!deleteModal.cardId) return;
    try {
      await deleteDoc(doc(db, "cards", deleteModal.cardId));
      toast({ title: "Success", description: "Product has been deleted successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete product.", variant: "destructive" });
    } finally {
      setDeleteModal({ isOpen: false, cardId: null, cardTitle: "" });
    }
  };

  return (
    <div className={darkMode ? "dark bg-gray-900 text-white min-h-screen" : "bg-gray-100 text-black min-h-screen"}>
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <h1 className="text-lg font-bold text-purple-600 dark:text-purple-400">Welcome, {user?.firstName || "Admin"}</h1>
          <div className="hidden md:flex items-center gap-4">
            <Button onClick={() => setIsModalOpen(true)} className="bg-purple-600 text-white">Upload New</Button>
            <Switch checked={darkMode} onCheckedChange={() => setDarkMode(!darkMode)} />
            <UserButton />
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      <main className="p-4 sm:p-8">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : cards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card) => (
              <ProductCard key={card.id} card={card} onEdit={setSelectedCard} onDelete={() => setDeleteModal({ isOpen: true, cardId: card.id, cardTitle: card.title })} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold">Welcome to Your Dashboard</h3>
            <p className="text-gray-600">Start building your collection by clicking the upload button.</p>
            <Button onClick={() => setIsModalOpen(true)} className="bg-purple-600 text-white">Upload Product</Button>
          </div>
        )}
      </main>

      <motion.button whileHover={{ scale: 1.05 }} onClick={() => setIsOrderModalOpen(true)} className="fixed bottom-6 right-6 p-3 bg-purple-600 text-white rounded-full shadow-lg">
        <ShoppingBag className="w-6 h-6" />
      </motion.button>

      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <EditModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} card={selectedCard} />
      <DeleteConfirmModal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, cardId: null, cardTitle: "" })} onConfirm={confirmDelete} productName={deleteModal.cardTitle} />
      <OrderModal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} />
    </div>
  );
}
