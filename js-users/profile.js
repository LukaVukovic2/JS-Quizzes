import { auth, onAuthStateChanged } from "../firebase/firebase-config.js";

const header = document.querySelector("header");
onAuthStateChanged(auth, user => {
  console.log(auth.currentUser)
  header.innerHTML = 
  ` <h2>My Profile:</h2>
    <p>Username: ${auth.currentUser.displayName}</p>
    <p>Email: ${auth.currentUser.email}</p>`
});


