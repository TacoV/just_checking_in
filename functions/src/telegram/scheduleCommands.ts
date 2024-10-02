import {Timestamp} from "firebase-admin/firestore";
import {Composer} from "telegraf";
import db from "../utils/db";

const composer = new Composer();

composer.command("remind", async (ctx) => {
  const schedulesRepos = db.schedules;

  const plans = Promise.all( [
    {time: "7:30", what: "ochtend"},
    {time: "12:30", what: "middag"},
    {time: "20:30", what: "avond"},
  ].map((info) => {
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
  } ) );

  const result = ctx.reply("Reminders gezet om 7:30, 12:30 en 20:30!");

  return Promise.all([plans, result]);
} );

composer.command("debug", async (ctx) => {
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
} );

composer.command("sleep", async (ctx) => {
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
} );

export default composer;
