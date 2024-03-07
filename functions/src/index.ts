import {onRequest} from "firebase-functions/v2/https";
import {defineString} from "firebase-functions/params";
import {initializeApp} from "firebase-admin/app";
import {getFirestore, Timestamp} from "firebase-admin/firestore";
import {Telegraf} from "telegraf";
import {logger} from "firebase-functions/v1";

const TELEGRAM_API_TOKEN = defineString("TELEGRAM_API_TOKEN");

initializeApp();

const bot = new Telegraf(TELEGRAM_API_TOKEN.value());

// Process basic commands /start and /help
bot.start((ctx) => ctx.reply("Yeah daar gaan we"));
bot.help((ctx) => ctx.reply("Ik weet het ook niet, kom ik op terug"));

bot.command("plan", async (ctx) => {
  ctx.reply("Planning the next moments");
});

// We could trigger some other way in the future - in a seperate function!
// But for now, trigger by sending /cron
bot.command("cron", async (ctx) => {
  const repos = getFirestore()
    .collection("questions");

  const questions = await repos
    .where("status", "==", "planned")
    .where("timing", "<", Timestamp.fromDate(new Date()))
    .get();

  if (questions.empty) {
    ctx.reply("No planned questions.");
    return;
  }

  ctx.reply(`We have ${questions.size} question(s) planned!`);
  questions.forEach( (doc) => {
    const savedData = doc.data();
    ctx.telegram.sendMessage(savedData.chat, savedData.question);
    repos.doc(savedData.id).set({"status": "asked"});
  });
});

// Schedule some questiosn!
bot.command("remind", async (ctx) => {
  ctx.reply("Need a reminder?");
  const inTwoMinutes = new Date((new Date()).getTime() + 2*60*1e3);
  await getFirestore()
    .collection("questions")
    .add({
      status: "planned", // asked, answered, dropped
      timing: Timestamp.fromDate(inTwoMinutes),
      question: "Does this work?",
      answers: ["Yes", "No"],
      chat: ctx.chat.id,
    });
  ctx.reply("Planned!");
});

// Fallback processing of messages
bot.on("message", async (ctx) => {
  // Let's only process text messages, not other updates
  if (ctx.text === undefined ) {
    logger.log("Ignoring update", {message: ctx.message});
    return;
  }

  // Log the info
  logger.log("Received uncaught message", {
    botname: ctx.botInfo.username,
    sender: ctx.message.from.first_name,
    text: ctx.text,
    chat: ctx.chat.type == "private" ? "private" : ctx.chat.title,
  });

  // Save infno to Firestore too - for now
  const writeResult = await getFirestore()
    .collection("messages")
    .add({
      action: "Did not process this message!",
      message: ctx.message,
      text: ctx.text,
    });
  ctx.reply(`Did not recognize command, just saved it @${writeResult.id}`);
});

// That's a wrap - let's export it to Google!
exports.telegram = onRequest(bot.webhookCallback());
