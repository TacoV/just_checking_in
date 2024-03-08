/* eslint-disable require-jsdoc */
import {getFirestore, Timestamp} from "firebase-admin/firestore";
import {Telegraf} from "telegraf";

// 2. Plan questions (cron)
async function planNextQuestions( ) {
  const schedulesCollection = getFirestore()
    .collection("schedules");

  // Evaluate every schedule that's almost running unplanned
  const scheduleHorizon = Timestamp.fromDate(
    new Date((new Date()).getTime() + 2*60*1e3)
  );
  const schedules = await schedulesCollection
    .where("scheduled", "<", scheduleHorizon)
    .get();

  // No schedules no work
  if (schedules.empty) {
    return;
  }

  const questionsCollection = getFirestore()
    .collection("questions");

  // We now have schedules with an array of schedules,
  // resulting in possibly multiple timestamps and a single
  // new horizon. @todo update the terminology to be less
  // confusing
  schedules.forEach( (doc) => {
    const data = doc.data();
    data.schedule.forEach( (d:any) => {
      const {newHorizon, timestamps} = planAhead(d);
      timestamps.forEach((planTimestamp) => {
        questionsCollection .add({
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
    });
  });
}

function planAhead(d:any) {
  if ("often" == d.type ) {
    const scheduleHorizon = Timestamp.fromDate(
      new Date((new Date()).getTime() + 2*60*1e3)
    );
    return {newHorizon: scheduleHorizon, timestamps: [scheduleHorizon]};
  }
  if ("daily timed" == d.type ) {
    const [h, m, s] = d.time.split(':');
    const nextTime = new Date;
    nextTime.setHours(h, m, s);
    if ( nextTime < new Date ) {
      nextTime.setDate(nextTime.getDate() + 1);
    }
    const scheduleHorizon = new Date(nextTime);
    scheduleHorizon.setHours(scheduleHorizon.getHours() + 12 );

    return {newHorizon: scheduleHorizon, timestamps: [nextTime]};
  }
  return {newHorizon: null, timestamps: []};
}

// 3. Ask questions (cron)
async function askedPlannedQuestions(bot:Telegraf) {
  const repos = getFirestore()
    .collection("questions");

  const questions = await repos
    .where("status", "==", "planned")
    .where("timing", "<", Timestamp.fromDate(new Date()))
    .get();

  if (questions.empty) {
    return;
  }

  questions.forEach( (doc) => {
    const savedData = doc.data();
    bot.telegram.sendMessage(savedData.chat, savedData.question);
    repos.doc(doc.id).set({
      "status": "asked",
    }, {merge: true});
  });
}

// That's a wrap - let's export it to Google!
export default function(bot:Telegraf) {
  return () => {
    planNextQuestions();
    askedPlannedQuestions(bot);
  };
}
