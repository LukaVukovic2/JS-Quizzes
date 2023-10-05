import { auth, createUserWithEmailAndPassword, updateProfile } from "../firebase/firebase-config.js";

const email = document.querySelector("#email");
const password = document.querySelector("#pass");
const username = document.querySelector("#username");
const signUpForm = document.querySelector("#signup-form");

username.addEventListener("click", console.log(username.value))

const userSignUp = async () => {
  const emailVal = email.value;
  const passVal = password.value;
  createUserWithEmailAndPassword(auth, emailVal, passVal)
    .then((userCredential) => {
      const user = userCredential.user;
      return updateProfile(user, {
        displayName: username.value
      }).then(() => {
        window.location.href = "../quizzes.html";
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      if (errorCode === "auth/email-already-in-use"){
        const element = document.createElement("p");
        const textnode = document.createTextNode("Email is already taken!");
        email.style.border = "1px solid red";
        element.style.color = "red";
        element.style.margin = "8px 0";
        element.appendChild(textnode);
      
        document.querySelector("#email-container").appendChild(element);
      }
      else {
        console.error("Error:", errorCode, errorMessage);
      }
      signUpForm.reset();
    });
};

signUpForm.addEventListener('submit', function (e) {
  e.preventDefault(); 
  userSignUp();
});