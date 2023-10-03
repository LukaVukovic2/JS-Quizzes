import { auth, onAuthStateChanged, push, quizzesInDB } from "../firebase/firebase-config.js";

const categoryContainer = document.querySelector(".select-category-container");
const category = document.querySelector(".select-category");
const quizTitle = document.querySelector(".quiz-title");
const questionInputContainer = document.querySelector(".create-question");
const questionContainer = document.querySelector(".questions-container");
const nextButton = document.querySelector(".next-btn");
const nextQuestionBtn = document.querySelector(".next-question-btn");
const quizQuestion = document.querySelector(".quiz-question");
const quizAnswer = document.querySelector(".quiz-answer");
const currentQuizQuestions = document.querySelector(".current-quiz-questions");
const terminateQuiz = document.querySelector(".terminate-quiz-btn");
const saveQuizBtn = document.querySelector(".save-quiz-btn");

let selectedOptionIndex = category.selectedIndex;
let selectedOption = category.options[selectedOptionIndex];
let inputCategory;
let quizInfo;
const questions = [];

category.addEventListener("change", () => {
  selectedOptionIndex = category.selectedIndex;
  selectedOption = category.options[selectedOptionIndex];

  if (selectedOption.value === "Other" && !inputCategory) {
    inputCategory = document.createElement("input");
    inputCategory.placeholder = "Which category?";
    inputCategory.style.marginTop = "10px";
    inputCategory.addEventListener("input", showNextButton);
    categoryContainer.appendChild(inputCategory);
  } else if (inputCategory) {
    categoryContainer.removeChild(inputCategory);
    inputCategory = null;
  }

  showNextButton();
});

function showNextButton() {
  if ((inputCategory && inputCategory.value.length >= 3) || selectedOption.value !== "Other") {
    nextButton.style.display = "block";
  } else {
    nextButton.style.display = "none";
  }
}

nextButton.addEventListener("click", (e) => {
  category.disabled = true;
  nextButton.disabled = true;
  e.preventDefault();
  questionContainer.style.display = "block";
});

nextQuestionBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let questionObj = parseQuestionAndAnswers();
  if (questionObj !== null && questionObj) {
    questions.push(questionObj);
    
    showCurrentQuizInputs(questionObj);
    resetQuestionInput();

    if ((questions.length === 10)){
      showButtonForSavingQuiz();
      return
    }
    if (questions.length >= 4){
      terminateQuiz.style.display = "inline-block";
    }
  }
});

function parseQuestionAndAnswers() {
  const answersText = quizAnswer.value;
  const answersArray = answersText.split(";");

  if(answersArray.length !== 4){
    alert("Please provide four answer options!");
    return;
  }
  else{
    const trimmedAnswers = answersArray.map(answer => answer.trim());

    const correctAnswerIndices = trimmedAnswers
      .map((answer, index) => (answer.toUpperCase() === answer ? index : -1))
      .filter(index => index !== -1);

    if (correctAnswerIndices.length !== 1) {
      alert("Please provide exactly one correctly capitalized answer.");
      return null;
    }

    const correctAnswerIndex = correctAnswerIndices[0];

    const questionObj = {
      question: quizQuestion.value,
      answers: trimmedAnswers,
      correctAnswerIndex: correctAnswerIndex
    };
    return questionObj;
  }
}

terminateQuiz.addEventListener("click", e =>{
  e.preventDefault();
  showButtonForSavingQuiz();
})

function showButtonForSavingQuiz(){
  onAuthStateChanged(auth, user => {
    console.log(auth.currentUser)
    quizInfo = {
      title: quizTitle.value,
      category: selectedOption.value,
      questions: questions,
      author: [auth.currentUser.displayName, auth.currentUser.reloadUserInfo.localId]
    };
    console.log(quizInfo);
    questionInputContainer.style.display = "none";
    saveQuizBtn.style.display = "block";
  });
}

function showCurrentQuizInputs(questionObj) {
  let i = questions.length;
  let string = `<p>${questions.length}. ${questionObj.question}</p><p>`;

  questionObj.answers.forEach((answer, answerIndex) => {
    string += `Answer ${answerIndex + 1}: ${answer}, `;
  });
  string = string.slice(0, -2);
  string += "</p><hr>";

  currentQuizQuestions.innerHTML += string;
}

saveQuizBtn.addEventListener("click", (e) =>{
  e.preventDefault();
  saveQuiz();
})

function saveQuiz(){
  push(quizzesInDB, quizInfo)
  .then(() => {
    console.log('Quiz has been successfully saved.');
    resetCreateQuizForm();
  })
  .catch((error) => {
    console.error('Error saving data:', error);
  });
}

function resetCreateQuizForm(){
  window.location.reload();
  alert("Quiz has been successfully saved.");
}

function resetQuestionInput(){
  quizQuestion.value = "";
  quizAnswer.value = "";
}
