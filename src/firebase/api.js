import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export const addScore = async (payload) => {
  try {
    const docRef = await addDoc(
      collection(db, `scores-${payload.length}`),
      {
        word: payload.word,
        time: payload.time,
        difficulty: payload.difficulty,
      }
    );
    console.log(docRef.id)
  } catch (e) {
    console.error(e);
  }
};

export const getScores = async (length) => {
  const querySnapshot = await getDocs(collection(db, `scores-${length}`));
  return querySnapshot
}
