import {auth, onAuthStateChanged} from "../firebase/firebase-config.js";

onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "login-form.html";
  }
});

function checkAuth() {
  const user = auth.currentUser;
  if (!user) {
    window.location.href = "login.html";
  }
}

function applyAuthChecks() {
  const protectedRoutes = ["quizzes.html","quiz.html","create-quiz.html","user-profile.html"];

  if (protectedRoutes.includes(window.location.pathname)) {
    checkAuth();
  }
}

export{applyAuthChecks}