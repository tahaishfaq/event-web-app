// firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxxbNX_YVclTSBqzCy9WYuDSA-ioa1GrQ",
  authDomain: "event-management-1a68f.firebaseapp.com",
  projectId: "event-management-1a68f",
  storageBucket: "event-management-1a68f.appspot.com",
  messagingSenderId: "1044321113319",
  appId: "1:1044321113319:web:374325a43bdfa3644abe42",
  measurementId: "G-BFRGDREPWJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Storage and get a reference to the service
const storage = getStorage(app);

// Export storage
export { storage };
