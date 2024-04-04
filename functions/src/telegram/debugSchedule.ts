import {getFirestore, Timestamp} from "firebase-admin/firestore";
import {Context} from "telegraf";
import {schedule} from "../types/schedule";
export default async function debugSchedule(ctx: Context) {
  await getFirestore()
    .collection("schedules")
    .add({
      question: {
        question: "Does this work?",
        answers: ["Yes", "No"],
      },
      chat: ctx.chat?.id,
      type: "often",
      parameters: {
        "minutes": 5,
        "firstrun": true,
      },
      scheduled: Timestamp.fromDate(new Date()),
    } as schedule);
}
