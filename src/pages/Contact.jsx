import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, MessageSquare, Send, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../Styles/Contact.css";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } },
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendToWhatsApp = async () => {
    const { name, email, message } = form;
    if (!name || !email || !message) {
      alert("Please fill all fields");
      return;
    }

    setSending(true);
    // Simulate sending delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const whatsappMessage = `Name: ${name}%0AEmail: ${email}%0AMessage: ${message}`;
    const whatsappURL = `https://wa.me/+971551016255?text=${whatsappMessage}`;
    window.open(whatsappURL, "_blank");

    setSuccess(true);
    setSending(false);

    // Reset form after delay
    setTimeout(() => {
      setForm({ name: "", email: "", message: "" });
      setSuccess(false);
    }, 2000);
  };

  return (
    <div className="contact-container">
      <Navbar />
      <div className="contact-wrapper">
        <motion.div
          className="contact-form"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Contact Us
          </motion.h2>

          <div className="form-fields">
            {Object.keys(form).map((field, index) => (
              <motion.div
                key={field}
                className="input-group"
                variants={inputVariants}
                whileHover="focus"
                whileTap="focus"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {field === "name" && <User className="input-icon" />}
                {field === "email" && <Mail className="input-icon" />}
                {field === "message" && (
                  <MessageSquare className="input-icon" />
                )}

                {field === "message" ? (
                  <textarea
                    name={field}
                    placeholder={`Your ${
                      field.charAt(0).toUpperCase() + field.slice(1)
                    }`}
                    value={form[field]}
                    onChange={handleChange}
                  />
                ) : (
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    placeholder={`Your ${
                      field.charAt(0).toUpperCase() + field.slice(1)
                    }`}
                    value={form[field]}
                    onChange={handleChange}
                  />
                )}
              </motion.div>
            ))}

            <motion.button
              className={`send-button ${sending ? "sending" : ""} ${
                success ? "success" : ""
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={sendToWhatsApp}
              disabled={sending || success}
            >
              {success ? (
                <CheckCircle className="success-icon" />
              ) : (
                <>
                  <Send className="send-icon" />
                  {sending ? "Sending..." : "Send to WhatsApp"}
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
