import { auth, onAuthStateChanged } from "../firebase/firebase-config.js";

const header = document.querySelector("header");
onAuthStateChanged(auth, user => {
  console.log(auth.currentUser)
  let created = new Date(auth.currentUser.metadata.creationTime);
  created = created.toDateString().slice(3);
  header.innerHTML = 
  ` <h2>My Profile:</h2>
    <p>Username: ${auth.currentUser.displayName}</p>
    <p>Email: ${auth.currentUser.email}</p>
    <p>Account created: ${created}`
});


