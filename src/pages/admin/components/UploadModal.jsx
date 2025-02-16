"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { db, collection, addDoc } from "../../../firebase/firebaseConfig";
import { Button } from "../../../components/ui/button";
import { CldUploadWidget } from "next-cloudinary";

const modalVariants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
    y: 40,
  },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      duration: 0.3,
    },
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    y: 40,
    transition: {
      duration: 0.3,
    },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      delay: 0.1,
    },
  },
};

export default function UploadModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    currency: "USD",
    images: [],
  });

  const autoResize = (element) => {
    element.style.height = "auto";
    element.style.height = element.scrollHeight + "px";
  };

  const preventScrollInput = (e) => {
    e.target.blur();
  };

  const handleImageUpload = (result) => {
    if (result.info.resource_type !== "image") {
      alert("Please upload only images");
      return;
    }

    if (formData.images.length >= 10) {
      alert("Maximum 10 images allowed");
      return;
    }

    const newImageUrl = result.info.secure_url;
    if (formData.images.some((img) => img === newImageUrl)) {
      alert("This image has already been uploaded");
      return;
    }

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      alert("Please upload at least one image");
      return;
    }
    setLoading(true);

    try {
      const productData = {
        title: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        currency: formData.currency,
        images: formData.images,
        createdAt: new Date().toISOString(),
      };

      // Add to Firestore - no need to update local state as listener will handle it
      await addDoc(collection(db, "cards"), productData);

      // Close modal and reset form
      onClose();
      setFormData({
        name: "",
        description: "",
        price: "",
        currency: "USD",
        images: [],
      });
    } catch (error) {
      console.error("Error uploading product:", error);
      alert("Error saving product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-4">
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden z-50 max-h-[90vh] flex flex-col"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="flex items-center justify-between p-6 border-b dark:border-gray-700"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Upload New Product
              </h2>
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X size={20} />
                </Button>
              </motion.div>
            </motion.div>

            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="p-6 space-y-4 overflow-y-auto scrollbar-none"
              style={{
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
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
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter product name"
                  />
                </div>

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
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                    dark:bg-gray-700 dark:border-gray-600 dark:text-white scrollbar-none"
                    style={{
                      msOverflowStyle: "none",
                      scrollbarWidth: "none",
                      resize: "none",
                    }}
                    rows={6}
                    placeholder="Enter product description"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                    Price
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.currency}
                      onChange={(e) =>
                        setFormData({ ...formData, currency: e.target.value })
                      }
                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                      onWheel={preventScrollInput}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Enter price in {formData.currency}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                    Product Images ({formData.images.length}/10)
                  </label>
                  <div className="mt-1 space-y-4">
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {formData.images.map((url, index) => (
                          <div
                            key={`${url}-${index}`}
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
                            <span className="absolute bottom-1 right-1 px-2 py-1 bg-black/50 text-white rounded-md text-xs">
                              {index + 1}/10
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {formData.images.length < 10 && (
                      <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 p-6">
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
                            alert("Error uploading image. Please try again.");
                          }}
                        >
                          {({ open }) => (
                            <div className="text-center">
                              <Button
                                type="button"
                                onClick={() => open()}
                                variant="outline"
                                className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-900/30"
                              >
                                Add Image ({formData.images.length}/10)
                              </Button>
                            </div>
                          )}
                        </CldUploadWidget>
                      </div>
                    )}

                    <p className="text-xs text-gray-500 text-center">
                      Upload up to 10 images (PNG, JPEG, GIF - max 10MB each)
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6"
              >
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white py-2.5 rounded-md transition-colors duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <span className="loading">⟳</span>
                    </motion.div>
                  ) : (
                    "Upload Product"
                  )}
                </motion.button>
              </motion.div>
            </motion.form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
