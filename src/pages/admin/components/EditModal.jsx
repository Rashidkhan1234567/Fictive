"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { db } from "../../../firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { Button } from "../../../components/ui/button";
import { CldUploadWidget } from "next-cloudinary";
import { useToast } from "../../../hooks/use-toast";

const modalVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export default function EditModal({ isOpen, onClose, card }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    currency: "USD",
    images: [],
  });

  // Update form when card changes
  useEffect(() => {
    if (card) {
      setFormData({
        name: card.title || "",
        description: card.description || "",
        price: card.price?.toString() || "",
        currency: card.currency || "USD",
        images: card.images || [],
      });
    }
  }, [card]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!card?.id) return;

    setLoading(true);
    try {
      const productData = {
        title: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        currency: formData.currency,
        images: formData.images,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(doc(db, "cards", card.id), productData);

      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (result) => {
    if (result.info.resource_type !== "image") {
      toast({
        title: "Error",
        description: "Please upload only images",
        variant: "destructive",
      });
      return;
    }

    if (formData.images.length >= 10) {
      toast({
        title: "Error",
        description: "Maximum 10 images allowed",
        variant: "destructive",
      });
      return;
    }

    const newImageUrl = result.info.secure_url;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, newImageUrl],
    }));
  };

  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg z-50 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Edit Product
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X size={20} />
              </Button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-6 space-y-4"
            >
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter product name"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                  Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows={4}
                  placeholder="Enter product description"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                  Price
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({ ...formData, currency: e.target.value })
                    }
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="AED">AED (د.إ)</option>
                    <option value="SAR">SAR (﷼)</option>
                    <option value="PKR">PKR (Rs)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                  Product Images ({formData.images.length}/10)
                </label>
                <div className="space-y-4">
                  {/* Existing Images */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.images.map((url, index) => (
                        <div
                          key={index}
                          className="relative group aspect-square"
                        >
                          <img
                            src={url}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload New Image */}
                  {formData.images.length < 10 && (
                    <CldUploadWidget
                      uploadPreset="Fictive"
                      options={{
                        maxFiles: 1,
                        resourceType: "image",
                        sources: ["local"],
                        maxImageFileSize: 10000000,
                        clientAllowedFormats: ["png", "jpeg", "jpg", "gif"],
                      }}
                      onSuccess={handleImageUpload}
                      onError={(error) => {
                        console.error("Upload error:", error);
                        toast({
                          title: "Error",
                          description:
                            "Failed to upload image. Please try again.",
                          variant: "destructive",
                        });
                      }}
                    >
                      {({ open }) => (
                        <Button
                          type="button"
                          onClick={() => open()}
                          variant="outline"
                          className="w-full"
                        >
                          Add Image ({formData.images.length}/10)
                        </Button>
                      )}
                    </CldUploadWidget>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {loading ? "Updating..." : "Update Product"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
