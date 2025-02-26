import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';



const firebaseConfig = {
    apiKey: "AIzaSyADg086_21AUEE_P6bCFTtC2e2YFf1ILQQ",
    authDomain: "cursoapp-237ae.firebaseapp.com",
    projectId: "cursoapp-237ae",
    storageBucket: "cursoapp-237ae.firebasestorage.app",
    messagingSenderId: "497017217280",
    appId: "1:497017217280:web:8d0239aa3b2394fa5a13e5",
    measurementId: "G-7E3DETD1C2"
  };

  const firebaseApp = initializeApp(firebaseConfig);

  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);

  export {db, auth};