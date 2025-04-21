// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
 apiKey: "AIzaSyDut1Xcy-e_gVgt-mtEw9pnNGrSq6lokWI",
 authDomain: "milo-d269a.firebaseapp.com",
 databaseURL: "https://milo-d269a-default-rtdb.firebaseio.com/", // Added the Realtime Database URL
 projectId: "milo-d269a",
 storageBucket: "milo-d269a.firebasestorage.app",
 messagingSenderId: "896627178352",
 appId: "1:896627178352:web:b1c423c9e393f4a3cfedb5",
 measurementId: "G-23L8N9CBQM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize Firebase Authentication
const googleAuthProvider = new GoogleAuthProvider();

export { app, analytics, auth, googleAuthProvider }; // Export the initialized app, analytics, and auth