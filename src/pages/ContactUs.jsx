import { useState } from "react";
import { motion } from "framer-motion";
import { FiPhone, FiMail, FiMapPin, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    { icon: FiPhone, title: "Phone", value: "+92-324-1914850" },
    { icon: FiMail, title: "Email", value: "support@crunchcorner.com" },
    { icon: FiMapPin, title: "Address", value: "123 Block A, Johar Town, Lahore, Pakistan" },
  ];

  return (
    <div className="p-4 pb-32">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center gap-3"
      >
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-primary-100 dark:bg-warmGray-800 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-warmGray-700 transition-all duration-200"
        >
          <FiArrowLeft className="w-5 h-5" />
        </motion.button>
        <div>
          <h1 className="text-3xl font-extrabold text-warmGray-900 dark:text-white">
            Contact Us
          </h1>
          <p className="text-warmGray-600 dark:text-warmGray-400 mt-2">
            We'd love to hear from you!
          </p>
        </div>
      </motion.div>

      <div className="space-y-4 mb-8">
        {contactInfo.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="flex items-center gap-4 p-4 bg-white dark:bg-warmGray-900 rounded-2xl shadow-sm border border-warmGray-100 dark:border-warmGray-800"
            >
              <div className="p-3 bg-primary-100 dark:bg-warmGray-800 rounded-xl">
                <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-warmGray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-warmGray-600 dark:text-warmGray-400">
                  {item.value}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-semibold text-warmGray-900 dark:text-white mb-2">
            Full Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-4 bg-white dark:bg-warmGray-900 border-2 border-warmGray-200 dark:border-warmGray-800 rounded-xl focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 text-warmGray-900 dark:text-white transition-all duration-200"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-warmGray-900 dark:text-white mb-2">
            Email
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-4 bg-white dark:bg-warmGray-900 border-2 border-warmGray-200 dark:border-warmGray-800 rounded-xl focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 text-warmGray-900 dark:text-white transition-all duration-200"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-warmGray-900 dark:text-white mb-2">
            Subject
          </label>
          <input
            type="text"
            required
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full p-4 bg-white dark:bg-warmGray-900 border-2 border-warmGray-200 dark:border-warmGray-800 rounded-xl focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 text-warmGray-900 dark:text-white transition-all duration-200"
            placeholder="How can we help?"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-warmGray-900 dark:text-white mb-2">
            Message
          </label>
          <textarea
            required
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full p-4 bg-white dark:bg-warmGray-900 border-2 border-warmGray-200 dark:border-warmGray-800 rounded-xl focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 text-warmGray-900 dark:text-white transition-all duration-200 resize-none"
            placeholder="Your message..."
          />
        </div>

        <motion.button
          type="submit"
          whileTap={{ scale: 0.97 }}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-200"
        >
          Send Message
        </motion.button>
      </motion.form>
    </div>
  );
}
