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
exports.cron = onSchedule("every 5 minutes", scheduleTick(bot));
