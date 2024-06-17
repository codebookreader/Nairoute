import firebase from "firebase/compat/app";
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDtGgtkVYh4kIf-_Un1bABwZFM9fDxK6vA",
  authDomain: "nairoute.firebaseapp.com",
  projectId: "nairoute",
  storageBucket: "nairoute.appspot.com",
  messagingSenderId: "1022053091756",
  appId: "1:1022053091756:web:700b0d977d172db6451209",
  measurementId: "G-8F89LFRV60"
}
firebase.initializeApp(firebaseConfig)

export default firebase