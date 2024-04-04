import {FirestoreDataConverter, getFirestore} from "firebase-admin/firestore";
import {Context} from "telegraf";
import {schedule} from "../types/schedule";

const converter = (): FirestoreDataConverter<schedule> => ({
  toFirestore:
    (data:schedule) =>
      data as FirebaseFirestore.DocumentData,
  fromFirestore:
    (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
      snap.data() as schedule,
});

export default async function listAll(ctx: Context) {
  const mySchedules = await getFirestore()
    .collection("schedules")
    .withConverter(converter())
    .where("chat", "==", ctx.chat?.id)
    .get();
  mySchedules.forEach(async (doc) => {
    await ctx.reply(`Schedule ${doc.data().type} asking: ` +
      doc.data().question.question);
  });

  const myQuestions = await getFirestore()
    .collection("questions")
    .where("chat", "==", ctx.chat?.id)
    .where("status", "==", "planned")
    .get();
  myQuestions.forEach( async (doc) => {
    await ctx.reply(
      doc.data().timing.toDate().toLocaleTimeString() +
        doc.data().question.question );
  });
}
