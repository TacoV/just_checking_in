import {getFirestore, Timestamp} from "firebase-admin/firestore";
import {Telegraf, Context} from "telegraf";
import {logger} from "firebase-functions/v2";

// eslint-disable-next-line require-jsdoc
async function createSchedule(ctx: Context) {
  ctx.reply("Setting up three daily reminders. " +
            "No customization possible yet!");
  await getFirestore()
    .collection("schedules")
    .add({
      question: "Does this work?",
      answers: ["Yes", "No"],
      chat: ctx.chat?.id,
      schedule: [
        {"type": "often", "every": "5 min"},
        {"type": "daily timed", "time": "07:00:00"},
      ],
      scheduled: Timestamp.fromDate(new Date()),
    });
  ctx.reply("Create a schedule for you!");
}

// eslint-disable-next-line require-jsdoc
async function clearSchedules(ctx:Context) {
  const repos = getFirestore()
    .collection("schedules");
  const mySchedules = await repos
    .where("chat", "==", ctx.chat?.id)
    .get();
  mySchedules.forEach( (doc) => {
    repos.doc(doc.id).delete();
  });
}


// eslint-disable-next-line require-jsdoc
export default function webhookCallbackA(bot:Telegraf) {
  bot.start((ctx) => ctx.reply("Yeah daar gaan we"));
  bot.help((ctx) => ctx.reply("Ik weet het ook niet, kom ik op terug"));

  // 1. Create a schedule (telegram webhook)
  bot.command("remind", createSchedule);

  // Clear all schedules for this chat
  bot.command("clear", clearSchedules);

  // Todo: 4. Process answers (telegram webhook)
  // Todo: list active schedules
  // Todo: delete schedules
  // Todo: edit schedules
  // Todo: see results of questions

  // Fallback processing of messages
  bot.on("message", async (ctx) => {
    logger.log("Received a message we cannot handle", {
      message: ctx.message,
      text: ctx.text,
      botname: ctx.botInfo.username,
      chat: ctx.chat.type == "private" ? "private" : ctx.chat.title,
    });
  });

  // That's a wrap
  return bot.webhookCallback();
}
