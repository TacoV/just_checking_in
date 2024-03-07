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

bot.on("message", async (ctx) => {
  logger.log("Received message", ctx.message);
  const writeResult = await getFirestore()
    .collection("messages")
    .add({
      message: ctx.message,
      update: ctx.update,
      state: ctx.state
    });
  ctx.reply(`Message with ID: ${writeResult.id} added.`);
});

bot.on('callback_query', ctx => ctx.answerCbQuery())

bot.on('inline_query', async (ctx) => {
  const result = []
  await ctx.answerInlineQuery(result)
})

exports.telegram = onRequest(bot.webhookCallback());
