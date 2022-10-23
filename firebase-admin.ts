import admin from "firebase-admin";
import serviceAccountCreds from "./service-account-file.json";

let db: admin.app.App | null = null;
try {
  db = admin.initializeApp(
    {
      credential: admin.credential.cert(serviceAccountCreds as any),
    },
    "adminApp"
  );
} catch (err) {
  db = admin.app("adminApp");
}

export default db as admin.app.App;
