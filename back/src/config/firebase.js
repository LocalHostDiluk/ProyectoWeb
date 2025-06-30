import admin from "firebase-admin";
import fs from "fs";

const serviceAccount = JSON.parse(
  fs.readFileSync(
    new URL(
      "../proyra-9feb9-firebase-adminsdk-fbsvc-e678b0e974.json",
      import.meta.url
    )
  )
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export { db };
