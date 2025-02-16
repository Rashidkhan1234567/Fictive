"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageSlider({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((current) => 
      current === 0 ? images.length - 1 : current - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((current) => 
      current === images.length - 1 ? 0 : current + 1
    );
  };

  if (!images?.length) return null;

  return (
    <div className="relative aspect-square rounded-xl overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative aspect-square"
        >
          <Image
            src={images[currentIndex]}
            alt={`Product image ${currentIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90"
            onClick={handleNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
