import admin from "firebase-admin";
import serviceAccountCreds from "./service-account-file.json";

const db = admin.initializeApp(
  {
    credential: admin.credential.cert(serviceAccountCreds as any),
  },
  "adminApp"
);

export default db;
