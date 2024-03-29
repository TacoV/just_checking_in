import {getFirestore, Timestamp} from "firebase-admin/firestore";
import {Telegraf, Context} from "telegraf";
import {logger} from "firebase-functions/v2";

// eslint-disable-next-line require-jsdoc
async function debugSchedule(ctx: Context) {
  await getFirestore()
    .collection("schedules")
    .add({
      question: "Does this work?",
      answers: ["Yes", "No"],
      chat: ctx.chat?.id,
      type: "often",
      parameters: {},
      scheduled: Timestamp.fromDate(new Date()),
    });
}

// eslint-disable-next-line require-jsdoc
async function createSchedule(ctx: Context) {
  ctx.reply("Reminders gezet om 8:00, 13:00 en 21:00!");
  await getFirestore()
    .collection("schedules")
    .add({
      question: "Heb je je ochtend-pillen geslikt?",
      answers: ["Ja", "Nee"],
      chat: ctx.chat?.id,
      type: "daily",
      parameters: {"time": "07:00"},
      scheduled: Timestamp.fromDate(new Date()),
    });
  await getFirestore()
    .collection("schedules")
    .add({
      question: "Heb je je middag-pillen geslikt?",
      answers: ["Ja", "Nee"],
      chat: ctx.chat?.id,
      type: "daily",
      parameters: {"time": "12:00"},
      scheduled: Timestamp.fromDate(new Date()),
    });
  await getFirestore()
    .collection("schedules")
    .add({
      question: "Heb je je avond-pillen geslikt?",
      answers: ["Ja", "Nee"],
      chat: ctx.chat?.id,
      type: "daily",
      parameters: {"time": "20:00"},
      scheduled: Timestamp.fromDate(new Date()),
    });
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

  const myQuestions = await getFirestore()
    .collection("questions")
    .where("chat", "==", ctx.chat?.id)
    .get();
  myQuestions.forEach( (doc) => {
    getFirestore().collection("questions")
      .doc(doc.id).delete();
  });
}

// eslint-disable-next-line require-jsdoc
export default function webhookCallbackA(bot:Telegraf) {
  bot.start((ctx) => ctx.reply("Yeah daar gaan we"));
  bot.help((ctx) => ctx.reply("Ik weet het ook niet, kom ik op terug"));

  // 1. Create a schedule (telegram webhook)
  bot.command("remind", createSchedule);
  bot.command("debug", debugSchedule);

  // Clear all schedules for this chat
  bot.command("clear", clearSchedules);

  // Todo: 4. Process answers (telegram webhook)
  // Todo: list active schedules
  // Todo: delete schedules
  // Todo: edit schedules
  // Todo: see results of questions

  bot.action(/answer-([a-zA-Z0-9]{20})-(\d+)/, (ctx) => {
    return ctx.answerCbQuery(
      `You picked answer ${ctx.match[2]}` +
      ` on question ${ctx.match[1]}`);
  });
  // Fallback processing of messages
  bot.on("message", (ctx) => {
    logger.log("Received a message we didnt handle", {
      message: ctx.message,
      text: ctx.text,
      botname: ctx.botInfo.username,
      chat: ctx.chat.type == "private" ? "private" : ctx.chat.title,
    });
  });
  bot.on("callback_query", (ctx) => {
    logger.log("Received an update we didnt handle", ctx.update );
    ctx.answerCbQuery("Message received");
    ctx.deleteMessage();
  } );
  bot.action(/.+/, (ctx) => {
    return ctx.answerCbQuery(`Oh, ${ctx.match[0]}! Great choice`);
  });

  // That's a wrap
  return bot.webhookCallback();
}
