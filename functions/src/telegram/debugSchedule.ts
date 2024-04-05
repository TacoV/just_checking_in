import {Timestamp} from "firebase-admin/firestore";
import {Context} from "telegraf";
import db from "../utils/db";

export default async function debugSchedule(ctx: Context) {
  await db.schedules
    .add({
      question: {
        question: "Does this work?",
        answers: ["Yes", "No"],
      },
      chat: ctx.chat?.id ?? 0,
      type: "often",
      parameters: {
        "minutes": 5,
        "firstrun": true,
      },
      scheduled: Timestamp.fromDate(new Date()),
    });
}
