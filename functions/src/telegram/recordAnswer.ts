import {Composer} from "telegraf";
import {getFirestore} from "firebase-admin/firestore";

const composer = new Composer();

composer.action(/doc([a-zA-Z0-9]{20})-answer(\d+)/, async (ctx) => {
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

export default composer;
