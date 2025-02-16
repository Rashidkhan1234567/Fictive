import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../Styles/components/Slider.css";

const ImageSlider = ({ slides = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const sliderRef = useRef(null);
  const slideRef = useRef(null);
  const progressInterval = useRef(null);

  // Animation variants for slides
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const [slideDirection, setSlideDirection] = useState(0);

  if (!slides || slides.length === 0) {
    return null;
  }

  useEffect(() => {
    setProgress(0);
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    if (!isHovered && slides.length > 0) {
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
            return 0;
          }
          return prev + 1;
        });
      }, 50);
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentIndex, slides.length, isHovered]);

  useEffect(() => {
    if (!slides || slides.length === 0) return;

    const autoSlideInterval = setInterval(() => {
      if (!isHovered) {
        setSlideDirection(1);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }
    }, 5000);

    return () => clearInterval(autoSlideInterval);
  }, [slides, isHovered]);

  const nextSlide = () => {
    setSlideDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setSlideDirection(-1);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    setStartX(e.type === "mousedown" ? e.pageX : e.touches[0].pageX);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const currentX = e.type === "mousemove" ? e.pageX : e.touches[0].pageX;
    const diff = startX - currentX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      setIsDragging(false);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="slider-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
    >
      {slides.length > 0 && (
        <>
          <AnimatePresence initial={false} custom={slideDirection}>
            <motion.div
              key={currentIndex}
              className="slide"
              custom={slideDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              <motion.img
                src={slides[currentIndex].url}
                alt={slides[currentIndex].title}
                className="slide-image"
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.7 }}
              />
              <motion.div
                className="slide-content"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <motion.h2
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  {slides[currentIndex].title}
                </motion.h2>
                <motion.p
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  {slides[currentIndex].description}
                </motion.p>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {slides.length > 1 && (
            <>
              <div className="slider-controls">
                <button className="nav-button prev" onClick={prevSlide}>
                  <ChevronLeft />
                </button>
                <button className="nav-button next" onClick={nextSlide}>
                  <ChevronRight />
                </button>
              </div>

              <div className="slider-progress">
                <div
                  className="progress-bar"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="slider-dots">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${currentIndex === index ? "active" : ""}`}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>

              <div className="thumbnails">
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${
                      currentIndex === index ? "active" : ""
                    }`}
                    onClick={() => goToSlide(index)}
                  >
                    <img src={slide.url} alt={`Thumbnail ${index + 1}`} />
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ImageSlider;
