import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBAJCCZATlCs3TZjajGbYceC6AjlKRDJBc",
  authDomain: "wordleplusplus.firebaseapp.com",
  projectId: "wordleplusplus",
  storageBucket: "wordleplusplus.appspot.com",
  messagingSenderId: "124534189537",
  appId: "1:124534189537:web:91704d1338560c143636a0",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);