import { auth, onAuthStateChanged, push, quizzesInDB, onValue, db, ref } from "../firebase/firebase-config.js";

const urlParams = new URLSearchParams(window.location.search);

const id = urlParams.get('id');

const quizRef = ref(db, `quizzes`);

