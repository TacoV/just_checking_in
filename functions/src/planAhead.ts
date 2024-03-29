import {Timestamp} from "firebase-admin/firestore";
import {DateTime} from "luxon";

function planOften() {
  const planFor = DateTime.now().startOf("hour").plus({hours: 1});
  const planEnd = DateTime.now().startOf("hour").plus({hours: 2});

  const timestamps: Timestamp[] = [];

  while (planFor < planEnd) {
    planFor.plus({minutes: 2});
    if ( planFor < DateTime.now() ) {
      timestamps.push(Timestamp.fromDate(planFor.toJSDate()));
    }
  }
  return {
    newHorizon: Timestamp.fromDate(
      planEnd.minus({minutes: 30}).toJSDate()
    ),
    timestamps: timestamps,
  };
}

function planDaily(parameters: any) {
  const [h, m, s] = parameters.time.split(":");
  const nextTime = new Date;
  nextTime.setHours(h, m, s);
  if (nextTime < new Date) {
    nextTime.setDate(nextTime.getDate() + 1);
  }
  const scheduleHorizon = new Date(nextTime);
  scheduleHorizon.setHours(scheduleHorizon.getHours() + 12);

  return {
    newHorizon: Timestamp.fromDate(scheduleHorizon),
    timestamps: [Timestamp.fromDate(nextTime)],
  };
}

export function getPlanner(type: string):
    ((parameters: any) => { newHorizon: Timestamp; timestamps: Timestamp[]; }) {
  switch (type) {
  case "often": return planOften;
  case "daily": return planDaily;
  }
  throw new Error("Unknown type");
}
