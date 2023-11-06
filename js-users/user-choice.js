import { auth, onAuthStateChanged } from "../firebase/firebase-config.js";

onAuthStateChanged(auth, user => {
  user = auth.currentUser;
  if (user) {
    window.location.href = "quizzes.html";
  }
});