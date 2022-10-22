import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG as string);

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
