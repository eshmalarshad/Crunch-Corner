import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import BottomNav from "./BottomNav";

export default function MobileLayout({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminView = user?.role === "admin" && location.pathname !== "/profile";

  return (
    <div className="h-screen flex flex-col bg-primary-50 dark:bg-warmGray-950">
      {isAdminView && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-primary-500 text-white"
        >
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 font-semibold hover:bg-white/20 px-3 py-2 rounded-xl transition-all duration-200"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to Admin Dashboard
          </button>
        </motion.div>
      )}
      <div className={`flex-1 overflow-y-auto ${isAdminView ? "" : "pb-20"}`}>
        {children}
      </div>
      {!isAdminView && <BottomNav />}
    </div>
  );
}