import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBmcC3Zb52m34RrQzA_Tahoh799e4JoKOE",
  authDomain: "scoutbook-acfc8.firebaseapp.com",
  projectId: "scoutbook-acfc8",
  storageBucket: "scoutbook-acfc8.appspot.com",
  messagingSenderId: "573689415931",
  appId: "1:573689415931:web:9e320e2a04b9266567485e"
};

export const app = initializeApp(firebaseConfig);