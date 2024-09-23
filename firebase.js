// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyChpteUK3f_pZCjltA44Pu2DWXM6keN9DY",
  authDomain: "project2-197c0.firebaseapp.com",
  projectId: "project2-197c0",
  storageBucket: "project2-197c0.appspot.com",
  messagingSenderId: "74299448223",
  appId: "1:74299448223:web:b21b92f69557bae0c97baa",
  measurementId: "G-Q272YHKK53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default app