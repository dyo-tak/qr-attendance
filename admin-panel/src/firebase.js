// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, where } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSkOaTc_5i751kjQpF8fgyO-T4oCMBhsE",
  authDomain: "events-attendance-941e3.firebaseapp.com",
  projectId: "events-attendance-941e3",
  storageBucket: "events-attendance-941e3.appspot.com",
  messagingSenderId: "884130927874",
  appId: "1:884130927874:web:81b045880145030f2d9e1b",
  measurementId: "G-HT6MJGW0Z6"
};

// Initialize Firebase````
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);