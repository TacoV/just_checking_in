import {onRequest} from "firebase-functions/v2/https";
import {defineString} from "firebase-functions/params";
import {initializeApp} from "firebase-admin/app";
// import {getFirestore} from "firebase-admin/firestore";
import {Telegraf} from "telegraf";

const TELEGRAM_API_TOKEN = defineString("TELEGRAM_API_TOKEN");

initializeApp();

const bot = new Telegraf(TELEGRAM_API_TOKEN.value());

bot.start((ctx) => ctx.reply("Welcome"));

/*
bot.hears("hi", (ctx) => ctx.reply("Hey there"));
bot.help((ctx) => ctx.reply("Send me a sticker"));

bot.command("hello", async (ctx) => {
  const writeResult = await getFirestore()
    .collection("messages")
    .add({query: ctx.botInfo});
  ctx.reply(`Message with ID: ${writeResult.id} added.`);
});
*/

exports.telegram = onRequest(bot.webhookCallback());
