import { auth, onAuthStateChanged, quizzesInDB, onValue } from "../firebase/firebase-config.js";
import { applyAuthChecks } from "../js-users/authentification-check.js";

let quizInfoContainer = document.querySelector(".quiz-info-container");
let quizzesArray;
let currentQuizID;


onAuthStateChanged(auth, user =>{
  applyAuthChecks()
})

onValue(quizzesInDB, function(snapshot){
  if(snapshot.exists()){
    quizInfoContainer.innerHTML = "";
    quizzesArray = Object.entries(snapshot.val());
    quizzesArray.forEach((quiz) => {
      currentQuizID = quiz[0];
      let currentQuizValue = quiz[1];
      let quizEl = document.createElement("div");
      quizEl.classList.add("quiz-info");
      let string = 
        ` <h3>${currentQuizValue.title}</h3>
          <p>Category: ${currentQuizValue.category}</p>
          <p>By: ${currentQuizValue.author[0]} &#183; Plays ${currentQuizValue.plays}</p>
          <a href="quiz.html?id=${currentQuizID}">Start Quiz</a>
        `;
      quizEl.innerHTML = string;
      quizInfoContainer.appendChild(quizEl);
    });
  }
  else{
    quizInfoContainer.innerHTML = 
      `There are no quizzes... yet.
      <div><a href='create-quiz.html'>Create your own quiz</a>
      so other people wouldn't be disappointed as you are now.</div>`;
  }
});


