import {Composer} from "telegraf";

import db from "../utils/db";

const composer = new Composer();

composer.command("clear", async (ctx) => {
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
});

composer.command("list", async (ctx) => {
  const mySchedules = await db.schedules
    .where("chat", "==", ctx.chat?.id)
    .get();

  mySchedules.forEach((doc) => {
    ctx.reply(`Schema ${doc.data().type}, vraag: ` +
      doc.data().question.question);
  });
} );


export default composer;
