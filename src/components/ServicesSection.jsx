import { motion } from "framer-motion";
import {
  CreditCard,
  Book,
  Coffee,
  ShoppingBag,
  Flag,
  CupSoda,
  FileText,
  Stamp,
  Shirt,
  Wine,
  Sticker,
  SignpostBig,
  HardHat,
} from "lucide-react";
import PropTypes from "prop-types";
import "../Styles/Services.css";

const services = [
  {
    name: "Business Cards",
    description:
      "Premium quality business cards with various finishes and materials",
    image:
      "https://res.cloudinary.com/dyuinsza5/image/upload/v1739095990/cex3mwx0tpcc83e2x9ai.webp",
    icon: <CreditCard className="icon-style" />,
  },
  {
    name: "Note Book",
    description: "Premium notebooks with custom designs and high-quality paper",
    image:
      "https://res.cloudinary.com/dyuinsza5/image/upload/v1739095775/mdpfuvsweklce8iprzlz.webp",
    icon: <Book className="icon-style" />,
  },
  {
    name: "Catalogs",
    description: "Professional product catalogs with stunning layouts",
    image:
      "https://res.cloudinary.com/dyuinsza5/image/upload/v1739096076/vja9h4qp1iqcedmmmyzi.jpg",
    icon: <Book className="icon-style" />,
  },
  {
    name: "CardBoard Cups",
    description: "Eco-friendly disposable cups with custom branding",
    image:
      "https://res.cloudinary.com/dyuinsza5/image/upload/v1739096572/gh2grpjl9mbm31skp3zm.jpg",
    icon: <Coffee className="icon-style" />,
  },
  {
    name: "Paper Bags",
    description: "Custom printed paper bags for retail and promotional use",
    image:
      "https://res.cloudinary.com/dyuinsza5/image/upload/v1739096184/zwfe0zov7aykmkx9m1ku.webp",
    icon: <ShoppingBag className="icon-style" />,
  },
  {
    name: "Rolls Banners",
    description: "Custom printed roll-up banners for advertising",
    image:
      "https://res.cloudinary.com/dyuinsza5/image/upload/v1739110768/jyannq6gf1wgsnfunvfx.jpg",
    icon: <Flag className="icon-style" />,
  },
  {
    name: "Cups Printing",
    description: "Customized printing on various types of cups and mugs",
    image:
      "https://res.cloudinary.com/dyuinsza5/image/upload/v1739110753/gjmm83kjzfetansox5ax.jpg",
    icon: <CupSoda className="icon-style" />,
  },
  {
    name: "Flyers",
    description: "Eye-catching flyers for effective marketing campaigns",
    image:
      "https://res.cloudinary.com/dyuinsza5/image/upload/v1739096591/aahmluwnylhvs7l3ynzy.jpg",
    icon: <FileText className="icon-style" />,
  },
  {
    name: "Stamps",
    description: "Custom rubber stamps and self-inking stamps",
    image:
      "https://res.cloudinary.com/dyuinsza5/image/upload/v1739110800/ma134fcayhim4j4nvtxx.webp",
    icon: <Stamp className="icon-style" />,
  },
  {
    name: "T-Shirt Printing",
    description: "High-quality custom t-shirt printing with various techniques",
    image:
      "https://res.cloudinary.com/dyuinsza5/image/upload/v1739110825/qzs2m0zvatqf6y9j4rdd.jpg",
    icon: <Shirt className="icon-style" />,
  },
  {
    name: "Custom Bottles",
    description: "Personalized water bottles and containers",
    image:
      "https://res.cloudinary.com/dyuinsza5/image/upload/v1739096545/tmvwt18mqow3q7nhsl5i.webp",
    icon: <Wine className="icon-style" />,
  },
  {
    name: "Custom Caps",
    description: "Embroidered and printed caps with your design",
    image:
      "https://res.cloudinary.com/dyuinsza5/image/upload/v1739110737/hbicpbapeq2fogpjmvd4.jpg",
    icon: <HardHat className="icon-style" />,
  },
  {
    name: "Stickers/Vinyl",
    description: "Custom stickers and vinyl prints for any surface",
    image:
      "https://res.cloudinary.com/dyuinsza5/image/upload/v1739110811/n9wejmdpilpvhkirbbmi.webp",
    icon: <Sticker className="icon-style" />,
  },
  {
    name: "Custom Signage",
    description: "Professional signage solutions for businesses",
    image:
      "https://res.cloudinary.com/dyuinsza5/image/upload/v1739110786/buy426sewjsrzdu7krgg.jpg",
    icon: <SignpostBig className="icon-style" />,
  },
];

const ServicesSection = ({ limit = 9 }) => {
  const displayedServices = services.slice(0, limit);
  const hasMoreServices = services.length > limit;
  const remainingCount = services.length - limit;

  return (
    <section className="services-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="title-container"
        >
          <span className="section-subtitle">What We Offer</span>
          <h2 className="section-title">Our Premium Services</h2>
          <p className="section-description">
            Discover our comprehensive range of high-quality printing services
          </p>
        </motion.div>

        <div className="grid-container">
          {displayedServices.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="service-card"
            >
              <motion.div
                whileHover={{ y: -12 }}
                className="service-card-inner"
              >
                <div className="image-container">
                  <img src={service.image} alt={service.name} loading="lazy" />
                  <div className="image-overlay" />
                  <motion.span
                    className="icon-container"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                  >
                    {service.icon}
                  </motion.span>
                </div>
                <div className="content">
                  <h3 className="service-title">{service.name}</h3>
                  <p className="service-description">{service.description}</p>
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="learn-more-btn"
                  >
                    Learn More →
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {hasMoreServices && (
          <motion.div
            className="view-more-services"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.a
              href="/services"
              className="view-all-services-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>View All Services</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </motion.a>
            {remainingCount > 0 && (
              <p className="remaining-services-count">
                Discover {remainingCount} more services
              </p>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};

ServicesSection.propTypes = {
  limit: PropTypes.number,
};

export default ServicesSection;
