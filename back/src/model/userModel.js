import { db } from "../config/firebase.js";

const collection = db.collection("alumnos");

export const saveUserToFirestore = async (data) => {
  const docRef = await collection.add({
    ...data,
    createdAt: new Date(),
  });

  return {
    id: docRef.id,
    ...data,
  };
};
