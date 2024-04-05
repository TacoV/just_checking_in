import {Timestamp} from "firebase-admin/firestore";
import {Context} from "telegraf";
import db from "../utils/db";

export default async function medsSchedule(ctx: Context) {
  const schedulesRepos = db.schedules;

  [
    {time: "7:30", what: "ochtend"},
    {time: "12:30", what: "middag"},
    {time: "20:30", what: "avond"},
  ]
    .forEach((info) => {
      schedulesRepos
        .add({
          question: {
            question: `Heb je je ${info.what}-pillen geslikt?`,
            answers: ["Ja", "Nee"],
          },
          chat: ctx.chat?.id ?? 0,
          type: "daily",
          parameters: {time: info.time},
          scheduled: Timestamp.fromDate(new Date()),
        });
    });

  ctx.reply("Reminders gezet om 7:30, 12:30 en 20:30!");
}
