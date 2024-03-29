import {getFirestore, Timestamp} from "firebase-admin/firestore";
import {Context} from "telegraf";

export default async function createSchedule(ctx: Context) {
  [{time: "7:30", what: "ochtend"},
    {time: "12:30", what: "middag"},
    {time: "20:30", what: "avond"}]
    .map((obj) => {
      return {
        time: obj.time,
        question: `Heb je je ${obj.what}-pillen geslikt?`,
      };
    } )
    .forEach((info): void => {
      getFirestore()
        .collection("schedules")
        .add({
          question: info.question,
          answers: ["Ja", "Nee"],
          chat: ctx.chat?.id,
          type: "daily",
          parameters: {time: info.time},
          scheduled: Timestamp.fromDate(new Date()),
        });
    });
  ctx.reply("Reminders gezet om 7:30, 12:30 en 20:30!");
}
