import {onSchedule} from "firebase-functions/v2/scheduler";
import {onRequest} from "firebase-functions/v2/https";
import {defineString} from "firebase-functions/params";
import {initializeApp} from "firebase-admin/app";
import {getFirestore, Timestamp} from "firebase-admin/firestore";
import {Telegraf} from "telegraf";
import {logger} from "firebase-functions/v1";

const TELEGRAM_API_TOKEN = defineString("TELEGRAM_API_TOKEN");

initializeApp();

const bot = new Telegraf(TELEGRAM_API_TOKEN.value());

/**
 * FUNCTION 1 - Telegram responses
 */

// Process basic commands /start and /help
bot.start((ctx) => ctx.reply("Yeah daar gaan we"));
bot.help((ctx) => ctx.reply("Ik weet het ook niet, kom ik op terug"));

// 1. Create a schedule (telegram webhook)
// 2. Plan questions (cron)
// 3. Ask questions (cron)
// 4. Process answers (telegram webhook)

// 1. Create a schedule (telegram webhook)
bot.command("remind", async (ctx) => {
  ctx.reply("Setting up three daily reminders. "+
          "No customization possible yet!");
  await getFirestore()
    .collection("schedules")
    .add({
      question: "Does this work?",
      answers: ["Yes", "No"],
      chat: ctx.chat.id,
      schedule: [
        {"type": "often", "every": "5 min"},
        {"type": "daily timed", "time": "07:00:00"},
      ],
      scheduled: Timestamp.fromDate(new Date()),
    });
  ctx.reply("Create a schedule for you!");
});

// Clear all schedules for this chat
bot.command("clear", async (ctx) => {
  logger.log(`Clear all schedules for chat ${ctx.chat.id}`);
  const repos = getFirestore()
    .collection("schedules");
  const mySchedules = await repos
    .where("chat", "==", ctx.chat.id)
    .get();
  mySchedules.forEach( (doc) => {
    repos.doc(doc.id).delete();
  });
});

// Todo: 4. Process answers (telegram webhook)
// Todo: list active schedules
// Todo: delete schedules
// Todo: edit schedules
// Todo: see results of questions

// Fallback processing of messages
bot.on("message", async (ctx) => {
  // Let's only process text messages, not other updates
  if (ctx.text === undefined ) {
    return;
  }

  // Save info to Firestore too - for now
  const writeResult = await getFirestore()
    .collection("messages")
    .add({
      message: ctx.message,
      text: ctx.text,
      botname: ctx.botInfo.username,
      chat: ctx.chat.type == "private" ? "private" : ctx.chat.title,
    });
  ctx.reply(`Did not recognize command, just saved it ${writeResult.id}`);
});

// That's a wrap - let's export it to Google!
exports.telegram = onRequest(bot.webhookCallback());

/**
 * FUNCTION 2 - Telegram messags
 */

// 2. Plan questions (cron)
async function planNextQuestions() {
  const repos = getFirestore()
    .collection("schedules");

  const schedules = await repos
    .where("scheduled", "<", Timestamp.fromDate(new Date()))
    .get();

  if (schedules.empty) {
    return;
  }

  const inFiveMinutes = new Date((new Date()).getTime() + 5*60*1e3);
  schedules.forEach( (doc) => {
    const data = doc.data();
    getFirestore()
      .collection("questions")
      .add({
        status: "planned", // asked, answered, dropped
        timing: Timestamp.fromDate(inFiveMinutes),
        question: data.question,
        answers: data.answers,
        chat: data.chat,
      });
    repos
      .doc(doc.id)
      .set({
        scheduled: Timestamp.fromDate(inFiveMinutes),
      }, {merge: true});
  });
}

// 3. Ask questions (cron)
async function askedPlannedQuestions() {
  const repos = getFirestore()
    .collection("questions");

  const questions = await repos
    .where("status", "==", "planned")
    .where("timing", "<", Timestamp.fromDate(new Date()))
    .get();

  if (questions.empty) {
    return;
  }

  questions.forEach( (doc) => {
    const savedData = doc.data();
    bot.telegram.sendMessage(savedData.chat, savedData.question);
    repos.doc(doc.id).set({
      "status": "asked",
    }, {merge: true});
  });
}

// That's a wrap - let's export it to Google!
exports.cron = onSchedule("every 1 minutes", async () => {
  planNextQuestions();
  askedPlannedQuestions();
}
);
