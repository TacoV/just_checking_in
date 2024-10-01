import {initializeApp} from "firebase-admin/app";
initializeApp();

import {defineString} from "firebase-functions/params";
import {Telegraf} from "telegraf";
const TELEGRAM_API_TOKEN = defineString("TELEGRAM_API_TOKEN");
const bot = new Telegraf(TELEGRAM_API_TOKEN.value());

import {onRequest} from "firebase-functions/v2/https";
import webhookCallback from "./telegram/webhookCallback";
exports.telegram = onRequest(
  {
    region: "europe-west3",
  },
  webhookCallback(bot)
);

import {onSchedule} from "firebase-functions/v2/scheduler";
import scheduleTick from "./cron/scheduleTick";
exports.cron = onSchedule(
  {
    region: "europe-west3",
    schedule: "every 15 minutes",
  },
  scheduleTick(bot)
);
