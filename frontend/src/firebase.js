import firebase from "firebase/compat/app";
import "firebase/compat/auth";
//import { initializeApp } from "firebase/app";

 // Your web app's Firebase configuration
 const firebaseConfig = {
   apiKey: "AIzaSyDopfSnvKrJXPnv9KiMfFjkzGE4iv9XD2E",
   authDomain: "fxfx-f8021.firebaseapp.com",
   projectId: "fxfx-f8021",
   storageBucket: "fxfx-f8021.appspot.com",
   messagingSenderId: "38762632967",
   appId: "1:38762632967:web:cfff09ca5b2c03fe1d97a2"
 };

 firebase.initializeApp(firebaseConfig);
 // export
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider(); 