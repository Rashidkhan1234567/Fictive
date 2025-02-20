import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import "../Styles/ReviewsSection.css"; // External CSS

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Marketing Director",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    review:
      "The quality of their business cards and marketing materials is exceptional. The attention to detail and premium finishes really make our brand stand out.",
    rating: 5,
    date: "2 weeks ago",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Small Business Owner",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    review:
      "Their custom packaging solutions transformed our product presentation. Fast turnaround times and excellent customer service!",
    rating: 5,
    date: "1 month ago",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "Event Coordinator",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    review:
      "The banner flags and promotional materials they created for our events are always perfect. Consistent quality and reliable service.",
    rating: 5,
    date: "3 weeks ago",
  },
];

export default function ReviewsSection() {
  return (
    <section className="reviews-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="header"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="tag"
          >
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="title"
          >
            What Our Clients Say
          </motion.h2>
        </motion.div>

        <div className="reviews-grid">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="review-card"
            >
              {/* Quote Icon */}
              <div className="quote-icon">
                <Quote size={20} className="quote-svg" />
              </div>

              {/* Rating */}
              <div className="rating">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="star-icon" />
                ))}
              </div>

              {/* Review Content */}
              <p className="review-text">&quot;{review.review}&quot;</p>

              {/* Reviewer Info */}
              <div className="reviewer">
                <img src={review.avatar} alt={review.name} className="avatar" />
                <div>
                  <h4 className="reviewer-name">{review.name}</h4>
                  <div className="reviewer-details">
                    <span>{review.role}</span>
                    &nbsp; &nbsp;
                    <span>{review.date}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
