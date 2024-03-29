import {getFirestore, Timestamp} from "firebase-admin/firestore";
import {Context} from "telegraf";
import {schedule} from "../types/schedule";

export default async function medsSchedule(ctx: Context) {
  const schedulesRepos = getFirestore()
    .collection("schedules");

  [
    {time: "7:30", what: "ochtend"},
    {time: "12:30", what: "middag"},
    {time: "20:30", what: "avond"},
  ]
    .forEach((info) => {
      schedulesRepos
        .add({
          question: `Heb je je ${info.what}-pillen geslikt?`,
          answers: ["Ja", "Nee"],
          chat: ctx.chat?.id,
          type: "daily",
          parameters: {time: info.time},
          scheduled: Timestamp.fromDate(new Date()),
        } as schedule);
    });

  ctx.reply("Reminders gezet om 7:30, 12:30 en 20:30!");
}
