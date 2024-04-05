import {Timestamp} from "firebase-admin/firestore";
import {Context} from "telegraf";
import db from "../utils/db";

export default async function sleepSchedule(ctx: Context) {
  const schedulesRepos = db.schedules;

  schedulesRepos
    .add({
      question: {
        question: "Hoe heb je geslapen?",
        answers: ["😩", "😑", "😴"],
      },
      chat: ctx.chat?.id ?? 0,
      type: "daily",
      parameters: {
        "time": "07:00",
      },
      scheduled: Timestamp.fromDate(new Date()),
    });

  ctx.reply("Reminder gezet om 7:00");
}


