import {DocumentData, getFirestore,
  QueryDocumentSnapshot, Timestamp} from "firebase-admin/firestore";
import {getPlanner} from "./planAhead";


const planSchedule = (doc: QueryDocumentSnapshot<DocumentData>) => {
  const schedulesCollection = getFirestore().collection("schedules");
  const questionsCollection = getFirestore().collection("questions");

  const data = doc.data();

  const planner = getPlanner(data.type);
  const {
    timestamps: timestamps,
    nextPlanMoment: nextPlanMoment
  } = planner(data.parameters);

  timestamps.forEach((timing) => {
    questionsCollection.add({
      status: "planned", // asked, answered, dropped
      timing: timing,
      question: data.question,
      answers: data.answers,
      chat: data.chat,
    });
  });

  schedulesCollection
    .doc(doc.id)
    .set({
      scheduled: nextPlanMoment,
    }, {merge: true});
};

export async function planNextQuestions() {
  const schedulesCollection = getFirestore().collection("schedules");
  const schedules = await schedulesCollection
    .where("scheduled", "<", Timestamp.now())
    .get();

  if (schedules.empty) {
    return;
  }

  schedules.forEach(planSchedule);
}
