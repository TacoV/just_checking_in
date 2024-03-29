import {getFirestore, Timestamp} from "firebase-admin/firestore";
import {Context} from "telegraf";


export default async function debugSchedule(ctx: Context) {
  await getFirestore()
    .collection("schedules")
    .add({
      question: "Does this work?",
      answers: ["Yes", "No"],
      chat: ctx.chat?.id,
      type: "often",
      parameters: {"minutes": 5},
      scheduled: Timestamp.fromDate(new Date()),
    });
}
