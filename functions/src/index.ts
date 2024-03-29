import {onRequest} from "firebase-functions/v2/https";
import {onSchedule} from "firebase-functions/v2/scheduler";

import {defineString} from "firebase-functions/params";
import {initializeApp} from "firebase-admin/app";

import {Telegraf} from "telegraf";

import webhookCallback from "./telegram";
import scheduleTick from "./cron";

const TELEGRAM_API_TOKEN = defineString("TELEGRAM_API_TOKEN");

initializeApp();

const bot = new Telegraf(TELEGRAM_API_TOKEN.value());

exports.telegram = onRequest(webhookCallback(bot));
exports.cron = onSchedule(
  {schedule: "every 5 minutes"},
  scheduleTick(bot)
);

/*
import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { DateTime } from "luxon";
import { Timestamp } from "firebase-admin/firestore";

initializeApp()

exports.test = onRequest(
  (req, res) => {
    let result = "Well hello there!<br />";

    const now = DateTime.now().setLocale('nl').setZone('Europe/Amsterdam');
    let planFor = now.startOf('hour').plus({ hours: 1 });
    const planEnd = now.startOf('hour').plus({ hours: 2 });

    const timestamps: Timestamp[] = [];

    while (planFor < planEnd) {
      timestamps.push(Timestamp.fromDate(planFor.toJSDate()));
      planFor = planFor.plus({ minutes: 2 });
    }

    res.status(200).send(result);
  }
);
*/
