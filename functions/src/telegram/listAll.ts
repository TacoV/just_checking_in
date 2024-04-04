import {Context} from "telegraf";
import db from "../utils/db";

export default async function listAll(ctx: Context) {
  const mySchedules = await db.schedules
    .where("chat", "==", ctx.chat?.id)
    .get();
  mySchedules.forEach(async (doc) => {
    await ctx.reply(`Schedule ${doc.data().type} asking: ` +
      doc.data().question.question);
  });

  const myQuestions = await db.questions
    .where("chat", "==", ctx.chat?.id)
    .where("status", "==", "planned")
    .get();
  myQuestions.forEach( async (doc) => {
    await ctx.reply(
      doc.data().timing.toDate().toLocaleTimeString +
        doc.data().question.question );
  });
}
