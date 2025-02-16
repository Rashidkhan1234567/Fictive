"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  ExternalLink,
  ChevronRight,
  ImageIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Badge } from "./badge";

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/products/${product.id}`);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-md text-sm">
            {product.currency} {product.price}
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {product.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {product.description}
          </p>
        </div>
      </motion.div>

      {/* Hover Modal */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute left-full top-0 ml-4 z-50 w-[350px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Image Gallery */}
            <div className="relative aspect-video">
              <Image
                src={product.images[selectedImage]}
                alt={product.title}
                fill
                className="object-cover"
              />
              <Badge variant="secondary" className="absolute top-2 right-2">
                <ImageIcon className="w-3 h-3 mr-1" />
                {product.images.length} images
              </Badge>
            </div>

            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <div className="flex gap-2 p-2 overflow-x-auto bg-gray-50 dark:bg-gray-900">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-14 aspect-square flex-shrink-0 rounded-md overflow-hidden ${
                      selectedImage === index
                        ? "ring-2 ring-purple-600"
                        : "ring-1 ring-gray-200"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`View ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="p-4">
              <Badge className="mb-2">{product.category}</Badge>
              <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                {product.description}
              </p>
              <div className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-4">
                {product.currency} {product.price}
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/products/${product.id}`);
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Place Order
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
