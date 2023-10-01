import { auth, onAuthStateChanged } from "https://lukavukovic2.github.io/JS-Quizzes/firebase/firebase-config.js";
import { checkAuthentification } from "https://lukavukovic2.github.io/JS-Quizzes/js-users/authentification-check.js";

checkAuthentification();

const header = document.querySelector("header");
onAuthStateChanged(auth, user => {
  header.innerHTML = 
  ` <h2>My Profile:</h2>
    <p>Username: ${auth.currentUser.displayName}</p>
    <p>Email: ${auth.currentUser.email}</p>`
});


