import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, push, onValue} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD6ESU7nWO7Le0h-v8LT0mD8N6ccowdGbc",
  authDomain: "js-project-23be3.firebaseapp.com",
  databaseURL: "https://js-project-23be3-default-rtdb.firebaseio.com",
  projectId: "js-project-23be3",
  storageBucket: "js-project-23be3.appspot.com",
  messagingSenderId: "555756532637",
  appId: "1:555756532637:web:d104162ca8c1f1cfd6b574"
};

const app = initializeApp(firebaseConfig);
console.log(app);

const db = getDatabase(app);
const quizzesInDB = ref(db, "quizzes");

const auth = getAuth(app);
export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, push, db, quizzesInDB, onValue };
