import { FirebaseApp, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAQqC9AnKm3G8Qapy7gb33OfnWGYmPSPRc",
  authDomain: "devdates101.firebaseapp.com",
  projectId: "devdates101",
  storageBucket: "devdates101.appspot.com",
  messagingSenderId: "752823091769",
  appId: "1:752823091769:web:e971ad05d1d6c993a703e8",
};

let app: FirebaseApp | null = null;
try {
  app = initializeApp(firebaseConfig);
} catch (err) {
  app = firebase.getApp();
}

export const storage = getStorage(app);
export const auth = getAuth(app);
