import {getFirestore, Timestamp} from "firebase-admin/firestore";
import {Context} from "telegraf";
import {schedule} from "../types/schedule";

export default async function sleepSchedule(ctx: Context) {
  const schedulesRepos = getFirestore()
    .collection("schedules");
  schedulesRepos
    .add({
      question: {
        question: "Hoe heb je geslapen?",
        answers: ["😩", "😑", "😴"],
      },
      chat: ctx.chat?.id,
      type: "often",
      parameters: {
        "minutes": 5,
        "firstrun": true,
      },
      // parameters: {time: "07:00"},
      scheduled: Timestamp.fromDate(new Date()),
    } as schedule);

  ctx.reply("Reminders gezet om 7:00");
}


