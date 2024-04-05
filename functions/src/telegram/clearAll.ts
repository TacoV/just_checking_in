import {Context} from "telegraf";
import db from "../utils/db";

export default async function clearAll(ctx: Context) {
  const mySchedules = await db.schedules
    .where("chat", "==", ctx.chat?.id)
    .get();

  mySchedules.forEach((doc) =>
    doc.ref.delete()
  );

  const myQuestions = await db.questions
    .where("chat", "==", ctx.chat?.id)
    .get();

  myQuestions.forEach((doc) =>
    doc.ref.delete()
  );
}
