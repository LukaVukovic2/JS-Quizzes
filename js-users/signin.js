import { auth, signInWithEmailAndPassword } from "../firebase/firebase-config.js";

const email = document.querySelector("#login-email");
const password = document.querySelector("#login-password");
const signInForm = document.querySelector("#login-form");
let element = document.querySelector("#error-message");

const userSignIn = async () => {
  const loginEmail = email.value;
  const loginPassword = password.value;

  // Clear any existing error message
  clearErrorMessage();

  signInWithEmailAndPassword(auth, loginEmail, loginPassword)
    .then((userCredential) => {
      const user = userCredential.user;
      alert("Success");

      // Navigate to the home page (replace "home.html" with the actual path)
      window.location.href = "../home.html";
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

function clearErrorMessage() {
  if (element) {
    element.remove();
    element = null;
    email.style.border = "";
    password.style.border = ""; // Clear the red border from the password input
  }
}

signInForm.addEventListener("submit", function (e) {
  e.preventDefault();
  userSignIn();
});
