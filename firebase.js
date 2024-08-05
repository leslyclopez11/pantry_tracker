// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFP6HQ6S4bBpOv8LplfQULYmi3gz9wzzY",
  authDomain: "inventory-management-34f96.firebaseapp.com",
  projectId: "inventory-management-34f96",
  storageBucket: "inventory-management-34f96.appspot.com",
  messagingSenderId: "888249949272",
  appId: "1:888249949272:web:b6a69ce7fc011cb3f73e2d",
  measurementId: "G-3KX8BTQXLL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}