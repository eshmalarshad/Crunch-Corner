import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, updateProfile, sendEmailVerification } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { loginUser, registerUser, logoutUser } from "../firebase/auth";
import API from "../utils/api";

export const AuthContext = createContext();

// Sync Firebase user with MongoDB and get complete user data
const syncAndFetchUser = async (firebaseUser) => {
  try {
    // First, login/register user in MongoDB
    const authResponse = await API.post("/auth/login", {
      email: firebaseUser.email,
      firebaseUid: firebaseUser.uid
    });

    // Save JWT token
    localStorage.setItem("token", authResponse.data.token);

    // Now fetch complete user data from MongoDB
    const userResponse = await API.get("/auth/me");

    // Merge Firebase data with MongoDB data
    return {
      ...firebaseUser,
      ...userResponse.data
    };
  } catch (error) {
    console.error("Error syncing user:", error);
    // If we can't sync, still return Firebase user as fallback
    return firebaseUser;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const completeUser = await syncAndFetchUser(currentUser);
        setUser(completeUser);
      } else {
        setUser(null);
        localStorage.removeItem("token");
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await loginUser(email, password);
      const completeUser = await syncAndFetchUser(userCredential.user);
      setUser(completeUser);
      return { success: true, user: completeUser };
    } catch (error) {
      return { success: false, msg: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      if (!email.endsWith("@gmail.com")) {
        return { success: false, msg: "Only Gmail accounts are allowed for registration!" };
      }

      const userCredential = await registerUser(email, password);
      
      // Update Firebase profile with name
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      // Send verification email
      await sendEmailVerification(userCredential.user);
      
      // Register in MongoDB
      await API.post("/auth/register", {
        name,
        email,
        firebaseUid: userCredential.user.uid
      });
      
      // Now fetch complete user data
      const completeUser = await syncAndFetchUser(userCredential.user);
      setUser(completeUser);
      
      return { success: true, user: completeUser, needsVerification: true };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, msg: error.message };
    }
  };

  const resendVerificationEmail = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        return { success: true };
      }
      return { success: false, msg: "No user logged in!" };
    } catch (error) {
      return { success: false, msg: error.message };
    }
  };

  const refreshUser = async () => {
    try {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        const completeUser = await syncAndFetchUser(auth.currentUser);
        setUser(completeUser);
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      localStorage.removeItem("token");
      return { success: true };
    } catch (error) {
      return { success: false, msg: error.message };
    }
  };

  const updateUser = async (data) => {
    console.log("=== updateUser CALLED ===");
    console.log("Data to update:", data);
    console.log("auth.currentUser:", auth.currentUser);
    try {
      if (auth.currentUser) {
        // Update Firebase profile if needed
        if (data.name) {
          console.log("Updating Firebase profile...");
          await updateProfile(auth.currentUser, {
            displayName: data.name
          });
        }
        
        // Update MongoDB user
        console.log("Updating MongoDB user...");
        const response = await API.put("/auth/me", data);
        console.log("MongoDB update response:", response.data);
        
        // Now refetch the complete user data from MongoDB
        console.log("Refetching complete user...");
        const completeUser = await syncAndFetchUser(auth.currentUser);
        console.log("Complete user after refetch:", completeUser);
        setUser(completeUser);
        
        return { success: true };
      }
      console.log("No auth.currentUser found!");
      return { success: false, msg: "No user logged in!" };
    } catch (error) {
      console.error("Error updating user:", error);
      console.error("Error details:", error.response?.data);
      return { success: false, msg: error.response?.data?.msg || error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, updateUser, resendVerificationEmail, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
