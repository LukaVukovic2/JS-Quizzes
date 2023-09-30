import { auth, onAuthStateChanged, push, quizzesInDB, onValue } from "../firebase/firebase-config.js";

let quizInfoContainer = document.querySelector(".quiz-info-container");

let quizzesArray;



onValue(quizzesInDB, function(snapshot){
  quizInfoContainer.innerHTML = "";
  quizzesArray = Object.values(snapshot.val());
  quizzesArray.forEach((quiz, index) => {
    let string = 
      ` <div class="quiz-info">
          <h3>${quiz.title}</h3>
          <p>Category: ${quiz.category}</p>
          <p>Author: ${quiz.author[0]}</p>
        </div>`;
    quizInfoContainer.innerHTML += string;
  });
});
