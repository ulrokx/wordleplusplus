import { collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "./firebase";
interface AddScorePayload {
  length: number;
  difficulty: number;
  name?: string;
  time: number;
  word: string;
}
export const addScore = async (payload: AddScorePayload) => {
  try {
    const docRef = await addDoc(
      collection(db, `scores-${payload.length}-${payload.difficulty}`),
      {
        name: payload.name || "Anonymous",
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

interface TopScoresPayload {
  length: number;
  difficulty: number;
  count: number;
}
export const getTopScores = async (payload: TopScoresPayload) => {
  const ref = collection(db, `scores-${payload.length}-${payload.difficulty}`);
  const q = query(ref, orderBy("time", "asc"), limit(payload.count))
  const data = await getDocs(q)
  return data.docs
}
