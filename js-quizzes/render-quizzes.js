import { auth, onAuthStateChanged, push, quizzesInDB, onValue } from "../firebase/firebase-config.js";
import { checkAuthentification } from "./authentification-check.js";

let quizInfoContainer = document.querySelector(".quiz-info-container");
let quizzesArray;
let currentQuizID;

checkAuthentification();

onValue(quizzesInDB, function(snapshot){
  if(snapshot.exists()){
    quizInfoContainer.innerHTML = "";
    quizzesArray = Object.entries(snapshot.val());
    let i = 0;
    quizzesArray.forEach((quiz, index) => {
      let currentQuiz = quizzesArray[i];
      currentQuizID = currentQuiz[0];
      let currentQuizValue = currentQuiz[1];
      let quizEl = document.createElement("div");
      quizEl.classList.add("quiz-info");
      let string = 
        ` <h3>${currentQuizValue.title}</h3>
          <p>Category: ${currentQuizValue.category}</p>
          <p>Author: ${currentQuizValue.author[0]}</p>
          <a href="quiz.html?id=${currentQuizID}">Start Quiz</a>
        `;
      quizEl.innerHTML = string;
      quizInfoContainer.appendChild(quizEl);
      i++;
    });
  }
  else{
    quizInfoContainer.innerHTML = 
      `There are no quizzes... yet.
      <div><a href='create-quiz.html'>Create your own quiz</a>
      so other people wouldn't be disappointed as you are now.</div>`;
  }
});


