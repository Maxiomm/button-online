import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAxeADK3OZwLI9fWLE3vcA8-luobGNo4rk",
  authDomain: "button-online-64cd1.firebaseapp.com",
  databaseURL:
    "https://button-online-64cd1-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "button-online-64cd1",
  storageBucket: "button-online-64cd1.appspot.com",
  messagingSenderId: "1061969254925",
  appId: "1:1061969254925:web:b2ec87596151d1a3a8d344",
  measurementId: "G-JV6C85QR2E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
