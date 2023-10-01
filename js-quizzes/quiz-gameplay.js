import { auth, onAuthStateChanged, push, quizzesInDB, onValue, db, ref } from "../firebase/firebase-config.js";
import { getDatabase, get} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

const specificQuizContainer = document.querySelector(".specific-quiz-container");
const finishQuizBtn = document.querySelector(".finish-quiz-btn");
let givenAnswers = [];
let correctAnswerEl;
const urlParams = new URLSearchParams(window.location.search);
let correctAnswers = [];


const id = urlParams.get('id');
const quizRef = ref(db, `quizzes/${id}`);

get(quizRef)
  .then((snapshot) => {
    if (snapshot.exists()) {
      const quizData = snapshot.val();
      console.log('Quiz Data:', quizData);
      finishQuizBtn.style.display = "block";
      displayQuiz(quizData);
    } else {
      specificQuizContainer.innerHTML = 'Quiz not found';
    }
  })
  .catch((error) => {
    console.error('Error fetching quiz data:', error);
  });

function displayQuiz(data) {
  let elements =
    `<h2>${data.title}</h2>
    <p>Author: ${data.author[0]}
    <p>${data.category}</p>
    `;
  data.questions.forEach((question, index) => {
    elements +=
      `<p>${index + 1}. ${question.question}</p><br>`;
    question.answers.forEach((option, i) => {
      option = capitalizeFirstLetter(option);
      const label = document.createElement('label');
      label.setAttribute('for', `question${index}_option${i}`);
      label.classList.add('question-options');

      const radioInput = document.createElement('input');
      radioInput.setAttribute('type', 'radio');
      radioInput.setAttribute('id', `question${index}_option${i}`);
      radioInput.setAttribute('name', `question${index}`);
      radioInput.setAttribute('value', `option${i}`);

      if (i === question.correctAnswerIndex) {
        label.setAttribute('data-correct-answer', 'true');
      }

      label.appendChild(radioInput);
      label.appendChild(document.createTextNode(option));

      elements += label.outerHTML;
      const correctOption = `option${question.correctAnswerIndex}`;
      correctAnswers.push(correctOption);
    })
  })
  specificQuizContainer.innerHTML = elements;
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

finishQuizBtn.addEventListener("click", (e) => {
  e.preventDefault();
  givenAnswers = [];
  let userScore = 0;
  const radioInputs = document.querySelectorAll('input[type="radio"]:checked');
  radioInputs.forEach((radioInput) => {
    givenAnswers.push(radioInput.value);
  });

  for (let i = 0; i < givenAnswers.length && i < correctAnswers.length; i++) {
    if (givenAnswers[i] === correctAnswers[i]) {
      userScore++;
    }
  }

  console.log("User's score:", userScore);
});

