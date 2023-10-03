import { auth, onAuthStateChanged, push, quizzesInDB, onValue, db, ref } from "../firebase/firebase-config.js";
import { getDatabase, get} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { perfectResult, excellentResult, goodResult, averageResult, belowAverageResult, failureResult } from "../js-quizzes/result-comment.js";

const quizHeader = document.querySelector(".quiz-header");
const specificQuizContainer = document.querySelector(".specific-quiz-container");
const finishQuizBtn = document.querySelector(".finish-quiz-btn");
const countdown = document.querySelector(".countdown");
const startingMinutes = 1;
let time = startingMinutes * 60;
let startBtn;
countdown.innerHTML = `${startingMinutes}: 00`;

const urlParams = new URLSearchParams(window.location.search);

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

const id = urlParams.get('id');
const quizRef = ref(db, `quizzes/${id}`);

get(quizRef)
  .then((snapshot) => {
    if (snapshot.exists()) {
      const quizData = snapshot.val();
      console.log('Quiz Data:', quizData);
      displayQuiz(quizData);
      showSelectedAnswer();
      toggleInputAvailability();
    } else {
      specificQuizContainer.innerHTML = 'Quiz not found';
    }
  })
  .catch((error) => {
    console.error('Error fetching quiz data:', error);
  });

function displayQuiz(data) {
  countdown.style.display = "block";
  startBtn = document.createElement("button");
  startBtn.classList.add("start-btn");
  startBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    if(!refreshIntervalId){
      startBtn.disabled = true;
      finishQuizBtn.style.display = "block";
      toggleInputAvailability();
      refreshIntervalId = setInterval(updateCountdown, 1000); 
    }
  })
  startBtn.innerHTML = "Start";
  quizHeader.insertBefore(startBtn, quizHeader.firstChild)
  let elements = `
    <h2>${data.title}</h2>
    <p>Author: ${data.author[0]}</p>
    <p>${data.category}</p>
  `;
  data.questions.forEach((question, index) => {
    elements += `
      <div class="question-container">
        <p>${index + 1}. <b>${question.question}</b></p>
    `;
    question.answers.forEach((option, i) => {
      option = capitalizeFirstLetter(option);
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
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

finishQuizBtn.addEventListener("click", (e) => {
  e.preventDefault();
  stopCountdown();
});

function calculateAndShowResult(){
  document.documentElement.scrollTop = 0;
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
  quizHeader.insertBefore(resultEl, countdown);
  finishQuizBtn.style.display = "none";

  restartQuizBtn = document.createElement("button");
  restartQuizBtn.innerHTML = "&#8635;";
  restartQuizBtn.classList.add("restart-quiz-btn");
  restartQuizBtn.title = "Restart quiz"

  quizHeader.insertBefore(restartQuizBtn, resultEl);
  restartQuizBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    restartQuiz();
    refreshIntervalId = setInterval(updateCountdown, 1000); 
    toggleCorrectAnswers();
    toggleInputAvailability();
  })
}

function restartQuiz(){
  selectedAnswers.forEach(input => {
    input.checked = false;
  })
  finishQuizBtn.style.display = "block";
  quizHeader.removeChild(restartQuizBtn);
  quizHeader.removeChild(resultEl);
  time = startingMinutes * 60;
  updateCountdown();
}

function toggleInputAvailability() {
  const inputs = document.querySelectorAll(".question-option-input");
  inputs.forEach((input) => {
    input.disabled = !input.disabled;
  });
  console.log("izv")
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
          checkmark.classList.add("question-checkmark");
          checkmark.style.color = "lightgreen";
          checkmark.innerHTML = " &#10003;"
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
      label.style.backgroundColor = "white";
    });
    removeSymbol(".question-checkmark");

    removeSymbol(".question-cross");
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
    });

    if (event.target.checked) {
      questionOptionLabelEl.style.backgroundColor = "rgb(226, 248, 254)";
    }
    });
  });
}

function addCrossSymbol(){
  cross = document.createElement("span");
  cross.classList.add("question-cross");
  cross.innerHTML = "  &#10060;";
  return cross;
}

function removeSymbol(selector) {
  const questions = document.querySelectorAll(selector);
  questions.forEach((question) => {
    question.innerHTML = question.innerHTML.slice(0, -8);
  });
}

function addResultComment() {
  let comment;

  switch (true) {
    case scorePercentage == 100:
      comment = getRandomComment(perfectResult);
      break;
    case scorePercentage > 90:
      comment = getRandomComment(excellentResult);
      break;
    case scorePercentage > 70:
      comment = getRandomComment(goodResult);
      break;
    case scorePercentage > 50:
      comment = getRandomComment(averageResult);
      break;
    case scorePercentage > 35:
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


function updateCountdown(){
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  seconds = seconds < 10 ? '0'+ seconds: seconds;

  countdown.innerHTML = `${minutes}: ${seconds}`;
  time--;
  if (time < 0) {
    stopCountdown();
  }
}

function stopCountdown(){
  clearInterval(refreshIntervalId);
  calculateAndShowResult();
  toggleInputAvailability();
  toggleCorrectAnswers();
  refreshIntervalId = null;
}