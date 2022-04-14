import { collection, addDoc, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "./firebase";
interface AddScorePayload {
  length: number;
  name?: string;
  time: number;
  difficulty: number
  word: string;
}
export const addScore = async (payload: AddScorePayload) => {
  try {
    const docRef = await addDoc(
      collection(db, `scores-${payload.length}`),
      {
        name: payload.name || "Anonymous",
        word: payload.word,
        time: payload.time,
        difficulty: payload.difficulty,
      }
    );
  } catch (e) {
    console.error(e);
  }
};


interface TopScoresPayload {
  length: number;
  count: number;
}
export const getTopScores = async (payload: TopScoresPayload) => {
  const ref = collection(db, `scores-${payload.length}`);
  const q = query(ref, orderBy("time", "asc"), limit(payload.count), where("time", "!=", 0))
  const data = await getDocs(q)
  return data.docs
}
