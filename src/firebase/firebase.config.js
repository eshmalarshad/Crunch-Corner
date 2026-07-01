import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCBeXUVdDmviPCN2XxZQ_HLaK7NrlQeeYQ",
  authDomain: "crunch-and-corner.firebaseapp.com",
  projectId: "crunch-and-corner",
  storageBucket: "crunch-and-corner.firebasestorage.app",
  messagingSenderId: "808890356568",
  appId: "1:808890356568:web:5848bceeef7fe509ef8b2d",
  measurementId: "G-E9KWT376NN",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;