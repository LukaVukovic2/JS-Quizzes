import { auth, onAuthStateChanged, signOut } from "../firebase/firebase-config.js";

const header = document.querySelector("header");

const userSignOut = async() => {
  await signOut(auth);
  window.location.href = "user-profile.html";
}

onAuthStateChanged(auth, user => {
  if (user) {
    let created = new Date(auth.currentUser.metadata.creationTime);
    created = created.toDateString().slice(3);
    header.innerHTML = 
      `<h2>My Profile:</h2>
       <p>Username: ${auth.currentUser.displayName}</p>
       <p>Email: ${auth.currentUser.email}</p>
       <p>Account created: ${created}`;
       const logoutButton = document.createElement("button");
       logoutButton.textContent = "Logout";
       logoutButton.classList.add("logout-btn");
       logoutButton.onclick = userSignOut;
       header.appendChild(logoutButton);
  } else {
    header.innerHTML = `<p>Nothing to see here as you are guest <i class="fa-regular fa-face-smile-wink fa-xl" style="color: #007bff;"></i></p>
    <button class="user-profile-login-btn" onclick="document.location='login-form.html'">Login</button>`;
  }
});
