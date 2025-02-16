'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, User, MessageSquare, Send } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';


export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendToWhatsApp = () => {
    const { name, email, message } = form;
    if (!name || !email || !message) {
      alert('Please fill all fields');
      return;
    }
    const whatsappMessage = `Name: ${name}%0AEmail: ${email}%0AMessage: ${message}`;
    const whatsappURL = `https://wa.me/+923110376185?text=${whatsappMessage}`; // apna number replace 
    window.open(whatsappURL, '_blank');
  };

  return (
    <div className="flex flex-col justify-between min-h-screen">
<Navbar />
    <div className="min-h-screen flex items-center justify-center bg-purple-100 dark:bg-gray-900 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }} 
        className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-300 mb-4">Contact Us</h2>
        <div className="space-y-4">
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700">
            <User className="text-purple-600 dark:text-purple-300 mr-2" />
            <input 
              type="text" 
              name="name" 
              placeholder="Your Name" 
              value={form.name} 
              onChange={handleChange} 
              className="w-full bg-transparent focus:outline-none"
            />
          </div>
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700">
            <Mail className="text-purple-600 dark:text-purple-300 mr-2" />
            <input 
              type="email" 
              name="email" 
              placeholder="Your Email" 
              value={form.email} 
              onChange={handleChange} 
              className="w-full bg-transparent focus:outline-none"
            />
          </div>
          <div className="flex items-start border rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700">
            <MessageSquare className="text-purple-600 dark:text-purple-300 mr-2 mt-1" />
            <textarea 
              name="message" 
              placeholder="Your Message" 
              value={form.message} 
              onChange={handleChange} 
              className="w-full bg-transparent focus:outline-none h-24"
            ></textarea>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendToWhatsApp} 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center"
          >
            <Send className="mr-2" /> Send to WhatsApp
          </motion.button>
        </div>
      </motion.div>
    </div>
    <Footer />
    </div>

  );
}
