import { auth, createUserWithEmailAndPassword } from "../firebase/firebase-config.js";

const email = document.querySelector("#email");
const password = document.querySelector("#pass");
const signUpForm = document.querySelector("#signup-form");

const userSignUp = async () => {
  const emailVal = email.value;
  const passVal = password.value;
  
  createUserWithEmailAndPassword(auth, emailVal, passVal)
    .then((userCredential) => {
      const user = userCredential.user;
      window.location.href = "https://lukavukovic2.github.io/JS-Quizzes/home.html";
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