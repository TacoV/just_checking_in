import {Timestamp} from "firebase-admin/firestore";
import {abstractQuestion} from "./question";

export interface oftenScheduleParams {
  minutes: number,
  firstrun: boolean
}
export interface dailyScheduleParams {
  time: string
}
export interface schedule {
  question: abstractQuestion,
  chat: number;
  type: "often" | "daily";
  parameters: oftenScheduleParams | dailyScheduleParams;
  scheduled: Timestamp;
}
