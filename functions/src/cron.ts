/* eslint-disable require-jsdoc */
import {getFirestore, Timestamp} from "firebase-admin/firestore";
import {logger} from "firebase-functions/v2";
import {Telegraf, Markup} from "telegraf";
import {InlineKeyboardButton} from "telegraf/typings/core/types/typegram";

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

  schedules.forEach( (doc) => {
    const data = doc.data();
    const {newHorizon, timestamps} = planAhead(
      data.type,
      data.parameters
    );
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
  });
}

function planAhead(type: string, parameters:any) {
  if ("often" == type ) {
    // Plan 1 hour at a time
    const scheduleHorizon = new Date((new Date()).getTime() + 60*60*1e3);
    // Fill in 2min increments
    const now = new Date;
    now.setSeconds(0);
    const timestamps:Timestamp[] = [];
    while ( now < scheduleHorizon ) {
      now.setMinutes(now.getMinutes() + 2);
      timestamps.push( Timestamp.fromDate(now));
    }
    return {
      newHorizon: Timestamp.fromDate(scheduleHorizon),
      timestamps: timestamps,
    };
  }

  if ("daily" == type ) {
    const [h, m, s] = parameters.time.split(":");
    const nextTime = new Date;
    logger.log("nextTime(1)", nextTime);
    nextTime.setHours(h, m, s);
    logger.log("nextTime(2)", nextTime);
    if ( nextTime < new Date ) {
      nextTime.setDate(nextTime.getDate() + 1);
    }
    logger.log("nextTime(3)", nextTime);
    const scheduleHorizon = new Date(nextTime);
    scheduleHorizon.setHours(scheduleHorizon.getHours() + 12 );

    return {
      newHorizon: Timestamp.fromDate(scheduleHorizon),
      timestamps: [nextTime],
    };
  }
  return {newHorizon: Timestamp.fromDate(
    new Date((new Date()).getTime() + 2*60*1e3)
  ), timestamps: []};
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

    const buttons:InlineKeyboardButton[] = [];
    savedData.answers.forEach( (answer:string) => {
      buttons.push( Markup.button.callback(answer, answer));
    } );

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

// That's a wrap - let's export it to Google!
export default function(bot:Telegraf) {
  return () => {
    const nu = new Date;
    logger.log("Het is nu ${nu}", nu);
    planNextQuestions();
    askedPlannedQuestions(bot);
  };
}
