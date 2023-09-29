import { auth, createUserWithEmailAndPassword, updateProfile } from "../firebase/firebase-config.js";
const email = document.querySelector("#email");
const username = document.querySelector("#username");
const password = document.querySelector("#pass");
const signUpForm = document.querySelector("#signup-form");
let element = document.querySelector("#error-message");

const userSignUp = async () => {
  const emailVal = email.value;
  const usernameVal = username.value;
  const passVal = password.value;

  await createUserWithEmailAndPassword(auth, emailVal, passVal)
    .then((userCredential) => {
      const user = userCredential.user;
      return updateProfile(user, {
        displayName: usernameVal
      }).then(() => {
        window.location.href = "../home.html";
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      if (errorCode === "auth/email-already-in-use") {
        if (!element) {
          element = document.createElement("p");
          element.id = "error-message";
          const textnode = document.createTextNode("Email is already taken!");
          email.style.border = "1px solid red";
          element.style.color = "red";
          element.style.margin = "8px 0";
          element.appendChild(textnode);

          document.querySelector("#email-container").appendChild(element);
        }
      } else {
        console.error("Error:", errorCode, errorMessage);
      }
      signUpForm.reset();
    });
};

signUpForm.addEventListener('submit', function (e) {
  e.preventDefault();
  userSignUp();
});

