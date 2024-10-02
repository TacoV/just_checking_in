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

    const sendMessage = bot.telegram.sendMessage(
      savedData.chat,
      savedData.question.question,
      {
        ...Markup.inlineKeyboard(buttons),
      }
    );

    const saveState = repos.doc(doc.id).update({
      status: "asked",
    });

    return Promise.all([sendMessage, saveState]);
  });
}
