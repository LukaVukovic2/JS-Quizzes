import { auth, onAuthStateChanged, push, quizzesInDB } from "../firebase/firebase-config.js";

const main = document.getElementsByTagName("main")[0];
const mainContainer = document.querySelector(".create-quiz-container");
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
const timeLimit = document.querySelector(".quiz-time-limit");
const questions = [];

let totalTimeInSeconds;
let selectedOptionIndex;
let selectedOption;
let inputCategory;
let quizInfo;

onAuthStateChanged(auth, user =>{
  if(user){
    category.addEventListener("change", () => {
      selectedOptionIndex = category.selectedIndex;
      selectedOption = category.options[selectedOptionIndex];
    
      if (selectedOption.value === "Other" && !inputCategory) {
        inputCategory = document.createElement("input");
        inputCategory.placeholder = "Which category?";
        inputCategory.style.marginTop = "10px";
        inputCategory.classList.add("input-category");
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
      if(inputCategory){
        inputCategory.disabled = true;
      }
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
      quizQuestion.focus();

    });
    
    function parseTimeInput(input) {
      const regex = /(\d+)\s*m(inute)?\s*(\d+)\s*s(econd)?/i;
      const match = input.match(regex);
    
      if (match) {
          const minutes = parseInt(match[1], 10);
          const seconds = parseInt(match[3], 10);
          if (minutes >= 0 && seconds >= 0) {
              return (minutes * 60) + seconds;
          }
      }
    
      return null;
    }
    
    function parseQuestionAndAnswers() {
      const answersText = quizAnswer.value;
      const answersArray = answersText.split(";");
    
      if (answersArray.length !== 5) {
        alert("Please provide four answer options, and repeat the correct answer as the fifth option.");
        return null;
      } else {
        const trimmedAnswers = answersArray.map(answer => answer.trim());
    
        const repeatedAnswerIndex = trimmedAnswers.slice(0, 4).indexOf(trimmedAnswers[4]);
    
        if (repeatedAnswerIndex === -1) {
          alert("The correct answer should match one of the provided answer options.");
          return null;
        }
    
        const correctAnswerIndex = repeatedAnswerIndex;
    
        const questionObj = {
          question: quizQuestion.value,
          answers: trimmedAnswers.slice(0, 4),
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
      if(inputCategory){
        selectedOption.value = inputCategory.value;
      }
      totalTimeInSeconds = parseTimeInput(timeLimit.value);
      onAuthStateChanged(auth, user => {
        quizInfo = {
          plays: 0,
          title: quizTitle.value,
          category: selectedOption.value,
          time: totalTimeInSeconds,
          questions: questions,
          author: [auth.currentUser.displayName, auth.currentUser.reloadUserInfo.localId]
        };
        questionInputContainer.style.display = "none";
        saveQuizBtn.style.display = "block";
      });
    }
    
    function showCurrentQuizInputs(questionObj) {
      let i = questions.length;
      let string = `<p>${questions.length}. ${questionObj.question}</p><p>`;
    
      questionObj.answers.slice(0, 4).forEach((answer, answerIndex) => {
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
      if (totalTimeInSeconds !== null) {
        push(quizzesInDB, quizInfo)
        .then(() => {
          resetCreateQuizForm();
        })
        .catch((error) => {
          console.error('Error saving data:', error);
        });
      } else{
        alert("Invalid time input!");
        return
      }
    }
    
    function resetCreateQuizForm(){
      window.location.reload();
      alert("Quiz has been successfully saved.");
    }
    
    function resetQuestionInput(){
      quizQuestion.value = "";
      quizAnswer.value = "";
    }
  }
  else{
    main.style.marginTop = "100px";
    mainContainer.style.marginTop = "25px";
    mainContainer.innerHTML = `<p>You need to be logged in to create quizzes <i class="fa-solid fa-circle-exclamation fa-xl" style="color: #eed202;"></i><p><br>
      <a class="auth-form-link" href="login-form.html">Login</a>
    `
  }
})



