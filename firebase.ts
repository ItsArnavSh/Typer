// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdX0frbTKMRwqma-sb2y7AD2vD475l8vc",
  authDomain: "typer-14be4.firebaseapp.com",
  projectId: "typer-14be4",
  storageBucket: "typer-14be4.firebasestorage.app",
  messagingSenderId: "128426789596",
  appId: "1:128426789596:web:b30197a47188238087c219",
  measurementId: "G-MXHH23N7DC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
