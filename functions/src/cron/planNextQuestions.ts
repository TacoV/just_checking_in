import {DocumentData, QueryDocumentSnapshot, Timestamp} from "firebase-admin/firestore";
import {getPlanner} from "./planAhead";
import db from "../utils/db";

const planSchedule = (doc: QueryDocumentSnapshot<DocumentData>) => {
  const data = doc.data();

  const planner = getPlanner(data.type);
  const {
    parameters: parameters,
    timestamps: timestamps,
    nextPlanMoment: nextPlanMoment,
  } = planner(data.parameters);

  timestamps.forEach((timing) => {
    db.questions.add({
      status: "planned",
      timing: timing,
      question: data.question,
      chat: data.chat,
      answer: null
    });
  });

  doc.ref.set({
      parameters: parameters,
      scheduled: nextPlanMoment,
    }, {merge: true});
};

export async function planNextQuestions() {
  const schedules = await db.schedules
    .where("scheduled", "<", Timestamp.now())
    .get();

  if (schedules.empty) {
    return;
  }

  schedules.forEach(planSchedule);
}
