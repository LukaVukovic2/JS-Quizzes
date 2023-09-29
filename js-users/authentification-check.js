import {auth, onAuthStateChanged} from "../firebase/firebase-config.js";

onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "login-form.html";
  }
  else{
    console.log(user.displayName);
  }
});
console.log(auth.currentUser);
