import {Composer} from "telegraf";
import {getFirestore} from "firebase-admin/firestore";
import {question} from "../types/question";

const composer = new Composer();

composer.action(/doc([a-zA-Z0-9]{20})-answer(\d+)/, async (ctx) => {
  const doc = getFirestore()
    .collection("questions")
    .doc(ctx.match[1]);
  const question = await doc.get();
  if (!question.exists) {
    return ctx.answerCbQuery("Kon document niet vinden!");
  }

  const data = question.data() as question;

  const answerId = parseInt(ctx.match[2]);
  const answer = data.question.answers[answerId];

  doc.set({
    status: "answered",
    answer: answer,
  }, {merge: true});

  ctx.deleteMessage();
  ctx.reply(`${data.question.question}: ${answer}`);

  return ctx.answerCbQuery(`Je koos ${answer}`);
});

export default composer;
