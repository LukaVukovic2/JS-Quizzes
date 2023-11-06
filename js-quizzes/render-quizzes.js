import { quizzesInDB, onValue } from "../firebase/firebase-config.js";

let quizInfoContainer = document.querySelector(".quiz-info-container");
let quizzesArray;
let currentQuizID;


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
          <p><i class="fa-solid fa-circle-user" style="color: #007bff;"></i> ${currentQuizValue.author[0]} &#183; Plays ${currentQuizValue.plays}</p>
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


