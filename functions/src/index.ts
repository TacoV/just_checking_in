import {onRequest} from "firebase-functions/v2/https";
import {defineString} from "firebase-functions/params";
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import {Telegraf} from "telegraf";
import {logger} from "firebase-functions/v1";

const TELEGRAM_API_TOKEN = defineString("TELEGRAM_API_TOKEN");

initializeApp();

const bot = new Telegraf(TELEGRAM_API_TOKEN.value());

bot.start((ctx) => ctx.reply("Welcome"));
bot.command("test", async (ctx) => ctx.reply("Tested"));
bot.help((ctx) => ctx.reply("No help to be found here"));

bot.command("hello", async (ctx) => {
  logger.log(ctx.message.from);
  const writeResult = await getFirestore()
    .collection("messages")
    .add({query: "Test"});
  ctx.reply(`Message with ID: ${writeResult.id} added.`);
});

exports.telegram = onRequest(bot.webhookCallback());
