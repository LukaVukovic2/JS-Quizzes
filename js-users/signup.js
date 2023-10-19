import { auth, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from "../firebase/firebase-config.js";

const email = document.querySelector("#email");
const password = document.querySelector("#pass");
const username = document.querySelector("#username");
const signUpForm = document.querySelector("#signup-form");
const emailContainer = document.querySelector("#email-container");
const formContainer = document.querySelector(".form-container");
let errorEmailEl;

const userSignUp = async () => {
  const emailVal = email.value;
  const passVal = password.value;

  createUserWithEmailAndPassword(auth, emailVal, passVal)
    .then((userCredential) => {
      const user = userCredential.user;
      return updateProfile(user, {
        displayName: username.value
      }).then(() => {
        window.location.href = "quizzes.html";
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === "auth/email-already-in-use"){
        if(!errorEmailEl){
          errorEmailEl = document.createElement("p");
          errorEmailEl.textContent = "Email is already taken!";
          email.style.border = "1px solid red";
          errorEmailEl.style.color = "red";
          errorEmailEl.style.margin = "8px 0";
          emailContainer.appendChild(errorEmailEl);
        }
      }
      else{
        formContainer.style.border = "1px solid red";
      }
      signUpForm.reset();
    });
};

signUpForm.addEventListener('submit', function (e) {
  e.preventDefault(); 
  userSignUp();
});