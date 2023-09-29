import { auth, signOut } from "../firebase/firebase-config.js";

const logoutLink = document.querySelector("#logout-link");
const userSignOut = async() => {
  await signOut(auth);
  window.location.href = "login-form.html";
}
logoutLink.addEventListener("click", userSignOut);