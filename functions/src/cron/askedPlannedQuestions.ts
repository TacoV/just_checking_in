import {getFirestore, Timestamp} from "firebase-admin/firestore";
import {Telegraf, Markup} from "telegraf";
import {question} from "../types/question";

// 3. Ask questions (cron)
export async function askedPlannedQuestions(bot: Telegraf) {
  const repos = getFirestore()
    .collection("questions");

  const questions = await repos
    .where("status", "==", "planned")
    .where("timing", "<", Timestamp.fromDate(new Date()))
    .get();

  if (questions.empty) {
    return;
  }

  questions.forEach((doc) => {
    const savedData = doc.data() as question;

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
      "status": "asked",
    }, {merge: true});
  });
}
