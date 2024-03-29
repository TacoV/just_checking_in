import {getFirestore} from "firebase-admin/firestore";
import {Telegraf} from "telegraf";
import clearSchedules from "./clearSchedules";
import createSchedule from "./createSchedule";
import debugSchedule from "./debugSchedule";


export default function webhookCallback(bot: Telegraf) {
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
  // Todo: set old unanswered questions to status dropped
  bot.action(/doc([a-zA-Z0-9]{20})-answer(\d+)/, async (ctx) => {
    const doc = getFirestore()
      .collection("questions")
      .doc(ctx.match[1]);
    const question = await doc.get();
    if (!question.exists) {
      return ctx.answerCbQuery("Kon document niet vinden!");
    }

    const data = question.data();

    const answer = data?.answers[ctx.match[2]];
    doc.set({
      status: "answered",
      answer: answer,
    }, {merge: true});

    ctx.deleteMessage();
    ctx.reply(`${data?.question}: ${answer}`);
    return ctx.answerCbQuery(`Je koos ${answer}`);
  });

  // That's a wrap
  return bot.webhookCallback();
}
