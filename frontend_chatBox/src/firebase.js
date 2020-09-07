import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCvIQx-fGdLvfEH06CdOHezYhzmk7y7SVs",
  authDomain: "whatsapp-c3fb2.firebaseapp.com",
  databaseURL: "https://whatsapp-c3fb2.firebaseio.com",
  projectId: "whatsapp-c3fb2",
  storageBucket: "whatsapp-c3fb2.appspot.com",
  messagingSenderId: "79990355909",
  appId: "1:79990355909:web:b4dfb521113960d413fdac",
  measurementId: "G-Q83N3S1VSM",
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
