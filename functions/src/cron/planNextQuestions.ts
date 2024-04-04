import {DocumentData, getFirestore,
  QueryDocumentSnapshot, Timestamp} from "firebase-admin/firestore";
import {getPlanner} from "./planAhead";
import {schedule} from "../types/schedule";
import {question} from "../types/question";

const planSchedule = (doc: QueryDocumentSnapshot<DocumentData>) => {
  const schedulesCollection = getFirestore().collection("schedules");
  const questionsCollection = getFirestore().collection("questions");

  const data = doc.data() as schedule;

  const planner = getPlanner(data.type);
  const {
    timestamps: timestamps,
    nextPlanMoment: nextPlanMoment,
  } = planner(data.parameters);

  timestamps.forEach((timing) => {
    questionsCollection.add({
      status: "planned",
      timing: timing,
      question: data.question,
      chat: data.chat,
    } as question);
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
