const firebaseConfig = {
  apiKey: "AIzaSyD6ESU7nWO7Le0h-v8LT0mD8N6ccowdGbc",
  authDomain: "js-project-23be3.firebaseapp.com",
  databaseURL: "https://js-project-23be3-default-rtdb.firebaseio.com",
  projectId: "js-project-23be3",
  storageBucket: "js-project-23be3.appspot.com",
  messagingSenderId: "555756532637",
  appId: "1:555756532637:web:d104162ca8c1f1cfd6b574"
};

firebase.initializeApp(firebaseConfig);
let usersDB = firebase.database().ref('users');
document.getElementById('register-form').addEventListener('submit', submitForm);

function submitForm(e){
  e.preventDefault();
  let username = getElementVal('name');
  let password = getElementVal('pass');
  
  saveCredentials(username, password);

  document.getElementById('register-form').reset();
}
const saveCredentials = (name, pass) => {
  let newUser = usersDB.push();
  newUser.set({
    username: name,
    password : pass
  })
}
const getElementVal = (id) =>{
  return document.getElementById(id).value;
}