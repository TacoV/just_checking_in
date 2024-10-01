import {Timestamp} from "firebase-admin/firestore";
import {Telegraf, Markup} from "telegraf";
import {DateTime} from "luxon";
import db from "../utils/db";

export async function askedPlannedQuestions(bot: Telegraf) {
  const repos = db.questions;

  const horizon = DateTime.now().plus({minutes: 10});
  const timestamp = Timestamp.fromDate(horizon.toJSDate());
  const questions = await repos
    .where("status", "==", "planned")
    .where("timing", "<", timestamp)
    .get();

  if (questions.empty) {
    return;
  }

  questions.forEach((doc) => {
    const savedData = doc.data();

    const buttons = savedData.question.answers
      .map( (answer:string, key:number) =>
        Markup.button.callback(
          answer,
          "doc" + doc.id +
        "-answer" + key
        )
      );

    bot.telegram.sendMessage(
      savedData.chat,
      savedData.question.question,
      {
        ...Markup.inlineKeyboard(buttons),
      }
    );

    repos.doc(doc.id).set({
      status: "asked",
    }, {merge: true});
  });
}
