import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload } from "lucide-react";
import { db, collection, addDoc } from "../../firebase/firebaseConfig";
import { CONFIG } from "../../utils/constants";
import "./UploadModal.css";

export default function UploadModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    currency: "USD",
    images: [],
  });

  const fileInputRef = useRef(null);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CONFIG.PRESET_NAME);
    
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );
      
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    
    if (formData.images.length + files.length > 10) {
      alert("Maximum 10 images allowed");
      return;
    }

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload only image files');
        continue;
      }

      try {
        const imageUrl = await uploadToCloudinary(file);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, imageUrl]
        }));
      } catch (error) {
        alert('Error uploading image. Please try again.');
      }
    }
  };

  const removeImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
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

      await addDoc(collection(db, "cards"), productData);
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
        <motion.div className="upload-modal-overlay">
          <motion.div className="upload-modal">
            <div className="modal-header">
              <h2>Upload New Product</h2>
              <button onClick={onClose} className="close-button">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="upload-form">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter product description"
                  rows={6}
                />
              </div>

              <div className="form-group">
                <label>Price</label>
                <div className="price-input">
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Product Images ({formData.images.length}/10)</label>
                <div className="images-grid">
                  {formData.images.map((url, index) => (
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

                {formData.images.length < 10 && (
                  <div className="upload-zone">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={handleUploadClick}
                      className="upload-button"
                    >
                      <Upload size={20} />
                      Add Image ({formData.images.length}/10)
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`submit-button ${loading ? "loading" : ""}`}
              >
                {loading ? "Uploading..." : "Upload Product"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
