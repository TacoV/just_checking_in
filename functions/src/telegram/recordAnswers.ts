import {Composer} from "telegraf";
import db from "../utils/db";
import {Timestamp} from "firebase-admin/firestore";
import {DateTime} from "luxon";

const composer = new Composer();

composer.action(/doc([a-zA-Z0-9]{20})-answer(\d+)/, async (ctx) => {
  const doc = db.questions.doc(ctx.match[1]);

  const question = await doc.get();
  if (!question.exists) {
    return ctx.answerCbQuery("Kon document niet vinden!");
  }

  const data = question.data();
  if ( data === undefined ) {
    throw new Error("Impossible undefined found");
  }

  const answerId = parseInt(ctx.match[2]);
  const answer = data.question.answers[answerId];

  /*
  const saveAnswer = doc.update({
    status: "answered",
    answer: answer,
  });
  */

  return Promise.all([
    doc.delete(),
    ctx.answerCbQuery(`Je koos ${answer}`),
    ctx.editMessageText(`${data.question.question}: ${answer}`),
  ]);
}).action(/doc([a-zA-Z0-9]{20})-snooze/, async (ctx) => {
  const doc = db.questions.doc(ctx.match[1]);

  const question = await doc.get();
  if (!question.exists) {
    return ctx.answerCbQuery("Kon document niet vinden!");
  }

  const data = question.data();
  if ( data === undefined ) {
    throw new Error("Impossible undefined found");
  }

  return Promise.all([
    doc.update({
      status: "planned",
      timing: Timestamp.fromDate(
        DateTime.now().plus({minutes: 10}).toJSDate()
      ),
    }),
    ctx.answerCbQuery("Tot straks!"),
    ctx.deleteMessage(),
  ]);
});

export default composer;
