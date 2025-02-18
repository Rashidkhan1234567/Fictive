import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { toast } from "sonner";
import { X, Upload, ImageIcon } from "lucide-react";
import axios from "axios";
import "../Styles/components/EditModal.css";

export default function EditModal({ isOpen, onClose, card }) {
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const uploadName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    currency: "",
    images: [],
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (card) {
      setFormData({
        title: card.title || "",
        description: card.description || "",
        price: card.price || "",
        currency: card.currency || "USD",
        images: card.images || [],
      });
      setSelectedImages(card.images || []);
    }
  }, [card]);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);

    if (selectedImages.length + files.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    setIsUploading(true);

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload only image files");
        continue;
      }

      try {
        const imageUrl = await uploadToCloudinary(file);
        setSelectedImages((prev) => [...prev, imageUrl]);
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, imageUrl],
        }));
      } catch (error) {
        toast.error("Error uploading image");
      }
    }

    setIsUploading(false);
  };

  const removeImage = (indexToRemove) => {
    setSelectedImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset); // Replace with your upload preset

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${uploadName}/image/upload`, // Replace with your cloud name
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      throw new Error("Failed to upload image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let imageUrl = formData.images[0];

      // Upload new image if selected
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const updatedData = {
        ...formData,
        images: [imageUrl],
      };

      const productRef = doc(db, "cards", card.id);
      await updateDoc(productRef, updatedData);

      toast.success("Product updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update product");
      console.error("Error updating product:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    // Limit description to 200 characters
    if (value.length <= 200) {
      setFormData({ ...formData, description: value });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="edit-modal-overlay">
          <motion.div className="edit-modal">
            <div className="modal-header">
              <h2>Edit Product</h2>
              <button onClick={onClose} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="modal-scrollable-content">
              <form onSubmit={handleSubmit} className="edit-form">
                <div className="image-upload-section">
                  <div className="images-grid">
                    {selectedImages.map((url, index) => (
                      <div key={index} className="image-item">
                        <img src={url} alt={`Product ${index + 1}`} />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="remove-image"
                        >
                          <X size={14} />
                        </button>
                        <span className="image-counter">{index + 1}/10</span>
                      </div>
                    ))}
                  </div>

                  {selectedImages.length < 10 && (
                    <label className="upload-button">
                      <Upload size={20} />
                      {selectedImages.length === 0
                        ? "Add Images"
                        : "Add More Images"}
                      <span className="image-count">
                        ({selectedImages.length}/10)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        multiple
                        hidden
                      />
                    </label>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="currency">Currency</label>
                    <select
                      id="currency"
                      value={formData.currency}
                      onChange={(e) =>
                        setFormData({ ...formData, currency: e.target.value })
                      }
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="AED">AED (د.إ)</option>
                      <option value="SAR">SAR (﷼)</option>
                      <option value="PKR">PKR (Rs)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="price">Price</label>
                  <input
                    type="number"
                    id="price"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">
                    Description
                    <span className="character-count">
                      {formData.description.length}/200
                    </span>
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={handleDescriptionChange}
                    rows={4}
                    className="description-textarea"
                    placeholder="Enter product description..."
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="save-button"
                    disabled={isUploading}
                  >
                    {isUploading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
