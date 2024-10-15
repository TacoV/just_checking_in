import { DocumentData, QueryDocumentSnapshot,
  Timestamp } from 'firebase-admin/firestore'
import { getPlanner } from './planAhead'
import db from '../utils/db'
import { schedule } from '../types/schedule'

const planSchedule = (doc: QueryDocumentSnapshot<schedule, DocumentData>) => {
  const data = doc.data()

  const planner = getPlanner(data.type)
  const {
    parameters: parameters,
    timestamps: timestamps,
    nextPlanMoment: nextPlanMoment,
  } = planner(data.parameters)

  const addQuestions = Promise.all(
    timestamps.map(async timing =>
      db.questions.add({
        status: 'planned',
        timing: timing,
        question: data.question,
        chat: data.chat,
        answer: null,
      }),
    ),
  )

  const addPlan = doc.ref.update({
    parameters: parameters,
    scheduled: nextPlanMoment,
  })

  return Promise.all([addPlan, addQuestions])
}

export async function planNextQuestions() {
  const schedules = await db.schedules
    .where('scheduled', '<', Timestamp.now())
    .get()

  if (schedules.empty) {
    return
  }

  for (const doc of schedules.docs) {
    await planSchedule(doc)
  }
}
