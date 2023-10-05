import { auth, signInWithEmailAndPassword, updateProfile } from "../firebase/firebase-config.js";

const email = document.querySelector("#login-email");
const password = document.querySelector("#login-password");
const signInForm = document.querySelector("#login-form");
let element = document.querySelector("#error-message");

const userSignIn = async () => {
  const loginEmail = email.value;
  const loginPassword = password.value;

  clearErrorMessage();

  await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
    .then((userCredential) => {
      const user = userCredential.user;
      window.location.href = "../quizzes.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      if (errorCode === "auth/invalid-login-credentials") {
        if (!element) {
          element = document.createElement("p");
          element.id = "error-message";
          const textnode = document.createTextNode("Email or password is incorrect.");
          email.style.border = "1px solid red";
          element.style.color = "red";
          password.style.border = "1px solid red";
          element.style.margin = "8px 0";
          element.appendChild(textnode);

          document.querySelector("#email-container-login").appendChild(element);
        }
      } else {
        console.error("Error:", errorCode, errorMessage);
      }
      signInForm.reset();
    });
};

signInForm.addEventListener('submit', function (e) {
  e.preventDefault();
  userSignIn();
});

function clearErrorMessage() {
  if (element) {
    element.remove();
    element = null;
    email.style.border = "";
    password.style.border = "";
  }
}
  
