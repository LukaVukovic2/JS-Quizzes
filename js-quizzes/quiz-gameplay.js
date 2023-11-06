import { auth, onAuthStateChanged, db, ref } from "../firebase/firebase-config.js";
import { get, update} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { perfectResult, excellentResult, goodResult, averageResult, belowAverageResult, failureResult } from "../js-quizzes/result-comment.js";
import { applyAuthChecks } from "../js-users/authentification-check.js";

const quizForm = document.querySelector(".quiz-form");
const quizHeader = document.querySelector(".quiz-header");
const specificQuizContainer = document.querySelector(".specific-quiz-container");
const quizTitle = document.querySelector(".quiz-title");
const finishQuizBtn = document.querySelector(".finish-quiz-btn");
const countdown = document.querySelector(".countdown");
const urlParams = new URLSearchParams(window.location.search);

let time;
let tempTime;
let startBtn;
let correctAnswersShown = false;
let selectedAnswers;
let correctAnswers = [];
let resultEl;
let restartQuizBtn;
let userAnswers;
let checkmark;
let cross;
let scorePercentage;
let refreshIntervalId;
let plays;

const id = urlParams.get('id');
const quizRef = ref(db, `quizzes/${id}`);

onAuthStateChanged(auth, user =>{
  applyAuthChecks();
})

get(quizRef)
  .then((snapshot) => {
    if (snapshot.exists()) {
      const quizData = snapshot.val();
      time = quizData.time || 100;
      plays = quizData.plays || 0;
      tempTime = time;
      updateCountdown();
      displayQuiz(quizData);
      showSelectedAnswer();
      toggleInputAvailability();
    } else {
      quizForm.innerHTML = 'Quiz not found';
    }
  })
  .catch((error) => {
    console.error('Error displaying quiz:', error.response.data);
  });

function shuffleQuestions(questionsDB) {
  for (let i = questionsDB.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questionsDB[i], questionsDB[j]] = [questionsDB[j], questionsDB[i]];
  }
  return questionsDB;
}

function displayQuiz(data) {
  startBtn = document.createElement("button");
  startBtn.classList.add("start-btn");
  startBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!refreshIntervalId) {
      startBtn.style.display = "none";
      finishQuizBtn.style.display = "block";
      toggleInputAvailability();
      refreshIntervalId = setInterval(updateCountdown, 1000);
      specificQuizContainer.style.display = "block";
    }
  });
  startBtn.innerHTML = `<i class="fa fa-play fa-xl" aria-hidden="true"></i>`;
  let elements = ``;
  let quizBasicInfo = `
    <h2 class="quiz-title">${data.title}</h2>
    <div><i class="fa-solid fa-circle-user" style="color: #007bff;"></i> ${data.author[0]} &#183; ${data.category} &#183; ${plays} Plays
    </div>
  `;
  quizTitle.innerHTML = quizBasicInfo;

  const questionsDB = shuffleQuestions(data.questions);

  questionsDB.forEach((question, index) => {
    elements += `
      <div class="question-container">
        <p><b>${index + 1}. ${question.question}</b></p>
    `;
    question.answers.forEach((option, i) => {
      const label = document.createElement('label');
      label.setAttribute('for', `question${index}_option${i}`);
      label.classList.add(`question-options`);

      const radioInput = document.createElement('input');
      radioInput.setAttribute('type', 'radio');
      radioInput.setAttribute('id', `question${index}_option${i}`);
      radioInput.setAttribute('name', `question${index}`);
      radioInput.setAttribute('value', `option${i}`);
      radioInput.setAttribute('data-question-index', `${index}`);
      radioInput.classList.add('question-option-input');
      label.appendChild(radioInput);
      label.appendChild(document.createTextNode(option));

      if (i === question.correctAnswerIndex) {
        const correctOption = `option${question.correctAnswerIndex}`;
        correctAnswers.push(correctOption);
        label.classList.add('correct-answer');
      }

      elements += label.outerHTML;

    });
    elements += `
      </div>
    `;
  });
  specificQuizContainer.innerHTML = elements;
  quizForm.insertBefore(startBtn, specificQuizContainer);
  countdown.style.display = "inline-block";
}


finishQuizBtn.addEventListener("click", (e) => {
  e.preventDefault();
  stopCountdown();
});

function calculateAndShowResult(){
  document.documentElement.scrollTop = 100;
  let userScore = 0;
  selectedAnswers = document.querySelectorAll('input[type="radio"]:checked');
  let numberOfQuestions;
  if(selectedAnswers){
    numberOfQuestions = correctAnswers.length;
    userAnswers = new Array(numberOfQuestions).fill(undefined);

    selectedAnswers.forEach((input) => {
      const questionIndex = input.getAttribute("data-question-index");
      const selectedValue = input.value;
      userAnswers[questionIndex] = selectedValue;
    });

    for (let i = 0; i < numberOfQuestions; i++) {
      if (userAnswers[i] === correctAnswers[i]) {
        userScore++;
      }
    }
  }
  scorePercentage = ((userScore / numberOfQuestions) * 100).toFixed(0);
  

  resultEl = document.createElement("pre");
  resultEl.innerHTML = `Score: <b>${userScore}/${numberOfQuestions}</b>    You got: <b>${scorePercentage}%</b>`
  resultEl.classList.add("result-element");
  addResultComment();
  
  quizHeader.append(resultEl);
  finishQuizBtn.style.display = "none";

  restartQuizBtn = document.createElement("button");
  restartQuizBtn.innerHTML = `<i class="fa-solid fa-rotate-right fa-rotate-270 fa-xl"></i>`;
  restartQuizBtn.classList.add("restart-quiz-btn");
  restartQuizBtn.title = "Restart quiz"

  quizHeader.append(restartQuizBtn);
  restartQuizBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    restartQuiz();
    toggleInputAvailability();
    toggleCorrectAnswers();
    refreshIntervalId = setInterval(updateCountdown, 1000); 
    
  })
}

function restartQuiz(){
  selectedAnswers.forEach(input => {
    input.checked = false;
  })
  finishQuizBtn.style.display = "block";
  quizHeader.removeChild(restartQuizBtn);
  quizHeader.removeChild(resultEl);
  time = tempTime;
  updateCountdown();
}

function toggleInputAvailability() {
  const inputs = document.querySelectorAll(".question-option-input");
  inputs.forEach((input) => {
    input.disabled = !input.disabled;
  });
}

function toggleCorrectAnswers(){
  const correctAnswerLabels = document.getElementsByClassName("correct-answer");
  const labelsArray = Array.from(correctAnswerLabels);
  const allLabels = document.getElementsByTagName("label");
  const allLabelsArray = Array.from(allLabels);

  if (!correctAnswersShown) {
    labelsArray.forEach((label, index) => {
      if((userAnswers[index] === correctAnswers[index]) || !userAnswers[index]){
        if(userAnswers[index] === correctAnswers[index]){
          checkmark = document.createElement("span");
          checkmark.innerHTML = ` <i class="fa-solid fa-circle-check fa-lg icon-class" style="color: #11ff00;"></i></i>`;
          label.parentElement.firstElementChild.appendChild(checkmark);
        }
        label.style.backgroundColor = "lightgreen";
        if(!userAnswers[index]){
          cross = addCrossSymbol();
          label.parentElement.firstElementChild.appendChild(cross);
        }
      }
      else{
        cross = addCrossSymbol();
        label.parentElement.firstElementChild.appendChild(cross);
        const questionContainer = label.parentElement;
        const labelElements = Array.from(questionContainer.querySelectorAll('.question-options'));
        for (const inputEl of labelElements) {
          if (inputEl.firstChild.value === `${userAnswers[index]}`) {
            inputEl.style.backgroundColor = "rgb(255, 68, 68)";
            label.style.backgroundColor = "lightgreen"
          }
        }
      }
    });
    correctAnswersShown = true;
  }
  else{
    allLabelsArray.forEach((label) => {
      label.style.backgroundColor = "";
      label.style.transform = "none";
    });

    removeSymbol();
    correctAnswersShown = false;
  }
  
}

function showSelectedAnswer() {
  const questionInputsEl = document.querySelectorAll('.question-option-input');

  questionInputsEl.forEach((input) => {
    input.addEventListener("change", (event)=>{
      const questionOptionLabelEl = event.target.parentElement;

      const otherOptions = questionOptionLabelEl.parentElement.querySelectorAll('.question-options');
      otherOptions.forEach((label) => {
        label.style.backgroundColor = "";
        label.style.transform = "none"
      });

      if (event.target.checked) {
        questionOptionLabelEl.style.backgroundColor = "rgb(200, 248, 254)";
        questionOptionLabelEl.style.transform = "scale(1.005)";
      }
    });
  });
}

function addCrossSymbol(){
  cross = document.createElement("span");
  cross.innerHTML = `
    <i class="fa-solid fa-circle-xmark fa-lg icon-class" style="color: #ff0000;"></i>
  `;
  return cross;
}

function removeSymbol() {
  const icons = document.querySelectorAll('.icon-class');
  icons.forEach((icon) => {
    icon.remove();
  });
}

function addResultComment() {
  let comment;

  switch (true) {
    case scorePercentage == 100:
      comment = getRandomComment(perfectResult);
      break;
    case scorePercentage > 89:
      comment = getRandomComment(excellentResult);
      break;
    case scorePercentage > 70:
      comment = getRandomComment(goodResult);
      break;
    case scorePercentage > 50:
      comment = getRandomComment(averageResult);
      break;
    case scorePercentage > 25:
      comment = getRandomComment(belowAverageResult);
      break;
    case scorePercentage >= 0:
      comment = getRandomComment(failureResult);
      break;
    default:
      break;
  }

  resultEl.innerHTML += `<br>${comment}`;
}

function getRandomComment(resultCommentArray) {
  if (resultCommentArray.length === 0) {
    return "";
  }
  const randomIndex = Math.floor(Math.random() * resultCommentArray.length);
  return resultCommentArray[randomIndex];
}

function updateCountdown() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const formattedSec = seconds < 10 ? '0' + seconds : seconds;
  const formattedMin = '0' + minutes;

  countdown.innerHTML = `${formattedMin}:${formattedSec}`;
  time--;

  if(time < 10){
    countdown.classList.add("fa-beat");
  }

  if (time < 0) {
    stopCountdown();
  }
}

function stopCountdown(){
  countdown.classList.remove("fa-beat");
  clearInterval(refreshIntervalId);
  calculateAndShowResult();
  toggleInputAvailability();
  toggleCorrectAnswers();
  quizHeader.style.position = "static";
  refreshIntervalId = null;
  plays++;
  const updatedData = {
    plays: plays,
  };
  update(quizRef, updatedData);
}

