import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBRWyg6Hg1ryiQhmWrdojuDbbkFfDcxNaY",
  authDomain: "galacticminters.firebaseapp.com",
  projectId: "galacticminters",
  storageBucket: "galacticminters.appspot.com",
  messagingSenderId: "1078159263361",
  appId: "1:1078159263361:web:3a295cf1b9bdf5a9966f80",
  measurementId: "G-XG0B38MENJ",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
