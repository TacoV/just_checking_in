import {DocumentData, getFirestore,
  QueryDocumentSnapshot, Timestamp} from "firebase-admin/firestore";
import {getPlanner} from "./planAhead";

const schedulesCollection = getFirestore().collection("schedules");
const questionsCollection = getFirestore().collection("questions");

const planSchedule = (doc: QueryDocumentSnapshot<DocumentData>) => {
  const data = doc.data();

  const planner = getPlanner(data.type);
  const {newHorizon, timestamps} = planner(data.parameters);

  timestamps.forEach((planTimestamp) => {
    questionsCollection.add({
      status: "planned", // asked, answered, dropped
      timing: planTimestamp,
      question: data.question,
      answers: data.answers,
      chat: data.chat,
    });
  });

  schedulesCollection
    .doc(doc.id)
    .set({
      scheduled: newHorizon,
    }, {merge: true});
};

export async function planNextQuestions() {
  const schedules = await schedulesCollection
    .where("scheduled", "<", Timestamp.now())
    .get();

  if (schedules.empty) {
    return;
  }

  schedules.forEach(planSchedule);
}
