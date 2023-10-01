import { auth, signOut } from "https://lukavukovic2.github.io/JS-Quizzes/firebase/firebase-config.js";
import { checkAuthentification } from "https://lukavukovic2.github.io/JS-Quizzes/js-users/authentification-check.js";

checkAuthentification();

const logoutLink = document.querySelector("#logout-link");
const userSignOut = async() => {
  await signOut(auth);
  window.location.href = "https://lukavukovic2.github.io/JS-Quizzes/login-form.html";
}
logoutLink.addEventListener("click", userSignOut);
