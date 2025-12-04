import { initializeApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';

// Firebase configuration from your test environment
const firebaseConfig = {
  apiKey: "AIzaSyCByY0NWY6vKS107sTNLbWEplvrcrWB0X8",
  authDomain: "quiz-app-poc.firebaseapp.com",
  databaseURL: "https://quiz-app-poc-default-rtdb.firebaseio.com",
  projectId: "quiz-app-poc",
  storageBucket: "quiz-app-poc.firebasestorage.app",
  messagingSenderId: "717778514436",
  appId: "1:717778514436:web:d562d0d586c66efaa77b51"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database: Database = getDatabase(app);

export { database };
