import {getFirestore, Timestamp} from "firebase-admin/firestore";
import {Telegraf, Markup} from "telegraf";
import {InlineKeyboardButton} from "telegraf/typings/core/types/typegram";

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
    const savedData = doc.data();

    const buttons: InlineKeyboardButton[] = [];
    savedData.answers.forEach((answer: string) => {
      buttons.push(Markup.button.callback(answer, answer));
    });

    bot.telegram.sendMessage(
      savedData.chat,
      savedData.question,
      {
        ...Markup.inlineKeyboard(buttons),
      }
    );

    repos.doc(doc.id).set({
      "status": "asked",
    }, {merge: true});
  });
}
