import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiChevronUp, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const faqs = [
  { id: 1, question: "How do I place an order?", answer: "Simply browse our menu, select the items you want, add them to your cart, and proceed to checkout!" },
  { id: 2, question: "What payment methods do you accept?", answer: "We accept only COD and bank transfer." },
  { id: 3, question: "How long does delivery take?", answer: "Delivery typically takes 30-45 minutes depending on your location and order volume." },
  { id: 4, question: "Can I cancel my order?", answer: "You can cancel your order within 5 minutes of placing it. Go to Orders → Active Orders → Cancel Order." },
  { id: 5, question: "How can I track my order?", answer: "You can track your order in real-time from the Orders page once your order is confirmed." },
];

export default function HelpFAQs() {
  const [openId, setOpenId] = useState(null);
  const navigate = useNavigate();

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
        <h1 className="text-3xl font-extrabold text-warmGray-900 dark:text-white">
          Help & FAQs
        </h1>
      </motion.div>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.03 }}
            className="bg-white dark:bg-warmGray-900 rounded-2xl shadow-sm border border-warmGray-100 dark:border-warmGray-800 overflow-hidden"
          >
            <motion.button
              whileTap={{ scale: 0.99 }}
              onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              className="w-full flex items-center justify-between p-4"
            >
              <h3 className="font-bold text-warmGray-900 dark:text-white text-left flex-1">
                {faq.question}
              </h3>
              {openId === faq.id ? (
                <FiChevronUp className="w-5 h-5 text-primary-500" />
              ) : (
                <FiChevronDown className="w-5 h-5 text-warmGray-500" />
              )}
            </motion.button>
            <AnimatePresence>
              {openId === faq.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-4 pb-4">
                    <p className="text-warmGray-700 dark:text-warmGray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-10 p-5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl text-white text-center"
      >
        <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
        <p className="opacity-90 mb-4">Contact our support team!</p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/contact-us")}
          className="bg-white text-primary-600 font-bold py-3 px-6 rounded-xl"
        >
          Contact Support
        </motion.button>
      </motion.div>
    </div>
  );
}
