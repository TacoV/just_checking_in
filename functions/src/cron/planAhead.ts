import {Timestamp} from "firebase-admin/firestore";
import {DateTime} from "luxon";
import {dailyScheduleParams, oftenScheduleParams} from "../types/schedule";

/*
 * Fill next hour with a message every x minutes
 */
function planOften(parameters: oftenScheduleParams) {
  const now = DateTime.now().setLocale("nl").setZone("Europe/Amsterdam");
  const interval: number = parameters.minutes;

  let planFor = parameters.firstrun ?
    now :
    now.startOf("hour").plus({hours: 1});
  const planEnd = now.startOf("hour").plus({hours: 2});

  const timestamps: Timestamp[] = [];

  while (planFor < planEnd) {
    timestamps.push(Timestamp.fromDate(planFor.toJSDate()));
    planFor = planFor.plus({minutes: interval});
  }

  return {
    parameters: {...parameters, firstrun: false},
    timestamps: timestamps,
    nextPlanMoment: Timestamp.fromDate(
      planEnd.minus({minutes: 10}).toJSDate()
    ),
  };
}

/*
 * Remind at standard time each day
 * Localized to NL
 */
function planDaily(parameters: dailyScheduleParams) {
  const [h, m] = parameters.time.split(":")
    .map( (str: string) => parseInt(str) );

  const now = DateTime.now()
    .setLocale("nl").setZone("Europe/Amsterdam");
  const today = now
    .startOf("day")
    .set({hour: h, minute: m});
  const tomorrow = today.plus({days: 1});

  const nextQuestion = now < today ? today : tomorrow;
  const nextPlanMoment = nextQuestion.plus({hours: 20});

  return {
    parameters: parameters,
    timestamps: [Timestamp.fromDate(nextQuestion.toJSDate())],
    nextPlanMoment: Timestamp.fromDate(nextPlanMoment.toJSDate()),
  };
}

export function getPlanner(type: string) {
  switch (type) {
  case "often": return planOften;
  case "daily": return planDaily;
  }
  throw new Error("Unknown type");
}
