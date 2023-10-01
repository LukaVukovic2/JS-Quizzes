import {auth, onAuthStateChanged} from "https://lukavukovic2.github.io/JS-Quizzes/firebase/firebase-config.js";

checkAuthentification();

function checkAuthentification(){
  onAuthStateChanged(auth, user => {
    if (!user) {
      window.location.href = "https://lukavukovic2.github.io/JS-Quizzes/login-form.html";
    }
    else{
      console.log(user.displayName);
    }
  });
  console.log(auth.currentUser);
}

export {checkAuthentification}