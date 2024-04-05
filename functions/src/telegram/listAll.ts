import {Context} from "telegraf";
import db from "../utils/db";

export default async function listAll(ctx: Context) {
  const mySchedules = await db.schedules
    .where("chat", "==", ctx.chat?.id)
    .get();

  mySchedules.forEach((doc) => {
    ctx.reply(`Schema ${doc.data().type}, vraag: ` +
      doc.data().question.question);
  });
}
