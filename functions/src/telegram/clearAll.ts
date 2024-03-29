import {getFirestore} from "firebase-admin/firestore";
import {Context} from "telegraf";

export default async function clearAll(ctx: Context) {
  const repos = getFirestore()
    .collection("schedules");

  const mySchedules = await repos
    .where("chat", "==", ctx.chat?.id)
    .get();

  mySchedules.forEach((doc) => {
    repos.doc(doc.id).delete();
  });

  const myQuestions = await getFirestore()
    .collection("questions")
    .where("chat", "==", ctx.chat?.id)
    .get();
  myQuestions.forEach((doc) => {
    getFirestore().collection("questions")
      .doc(doc.id).delete();
  });
}
