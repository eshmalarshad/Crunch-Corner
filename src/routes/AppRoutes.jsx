import { Routes, Route, Navigate } from "react-router-dom";
import Splash from "../pages/Splash";
import Welcome from "../pages/Welcome";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Menu from "../pages/Menu";
import FoodDetail from "../pages/FoodDetail";
import Cart from "../pages/Cart";
import Orders from "../pages/Orders";
import Profile from "../pages/Profile";
import DeliveryAddress from "../pages/DeliveryAddress";
import PaymentMethods from "../pages/PaymentMethods";
import ContactUs from "../pages/ContactUs";
import HelpFAQs from "../pages/HelpFAQs";
import MyProfile from "../pages/MyProfile";
import ChangePassword from "../pages/ChangePassword";
import Settings from "../pages/Settings";
import MobileLayout from "../components/layout/MobileLayout";
import AdminLayout from "../components/layout/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminDashboard from "../pages/AdminDashboard";
import AdminFoodManagement from "../pages/AdminFoodManagement";
import AdminCategoryManagement from "../pages/AdminCategoryManagement";
import AdminOrderManagement from "../pages/AdminOrderManagement";
import AdminProfile from "../pages/AdminProfile";
import AdminSettings from "../pages/AdminSettings";
import { useAuth } from "../context/AuthContext";

// Helper function to check if user is admin
const isAdmin = (user) => {
  return user && (user.role === "admin" || user.role === "Admin");
};

export default function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-primary-50 dark:bg-warmGray-950">
        <div className="text-2xl font-bold text-warmGray-600 dark:text-warmGray-300">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route
        path="/welcome"
        element={
          user && user.emailVerified ? (
            <Navigate to={isAdmin(user) ? "/admin" : "/menu"} replace />
          ) : (
            <Welcome />
          )
        }
      />
      <Route
        path="/login"
        element={
          user && user.emailVerified ? (
            <Navigate to={isAdmin(user) ? "/admin" : "/menu"} replace />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/register"
        element={
          user && user.emailVerified ? (
            <Navigate to={isAdmin(user) ? "/admin" : "/menu"} replace />
          ) : (
            <Register />
          )
        }
      />

      {/* ADMIN ROUTES */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/foods"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminFoodManagement />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminCategoryManagement />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminOrderManagement />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminProfile />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminSettings />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* USER ROUTES */}
      <Route
        path="/food/:id"
        element={
          <ProtectedRoute>
            <FoodDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/menu"
        element={
          <ProtectedRoute>
            <MobileLayout>
              <Menu />
            </MobileLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <MobileLayout>
              <Cart />
            </MobileLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <MobileLayout>
              <Orders />
            </MobileLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MobileLayout>
              <Profile />
            </MobileLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-profile"
        element={
          <ProtectedRoute>
            <MobileLayout>
              <MyProfile />
            </MobileLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <MobileLayout>
              <ChangePassword />
            </MobileLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/delivery-address"
        element={
          <ProtectedRoute>
            <MobileLayout>
              <DeliveryAddress />
            </MobileLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment-methods"
        element={
          <ProtectedRoute>
            <MobileLayout>
              <PaymentMethods />
            </MobileLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/contact-us"
        element={
          <ProtectedRoute>
            <MobileLayout>
              <ContactUs />
            </MobileLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/help-faqs"
        element={
          <ProtectedRoute>
            <MobileLayout>
              <HelpFAQs />
            </MobileLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <MobileLayout>
              <Settings />
            </MobileLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
