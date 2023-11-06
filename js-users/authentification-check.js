import { auth } from "../firebase/firebase-config.js";

function checkAuth() {
  const user = auth.currentUser;
  if (!user) {
    window.location.href = "login-form.html";
  }
}

function applyAuthChecks() {
  const protectedRoutes = ["create-quiz.html"];

  if (protectedRoutes.includes(window.location.pathname)) {
    checkAuth();
  }
}

export{applyAuthChecks}