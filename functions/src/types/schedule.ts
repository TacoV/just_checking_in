import {Timestamp} from "firebase-admin/firestore";

export interface oftenScheduleParams {
  minutes: number
}
export interface dailyScheduleParams {
  time: string
}
export interface schedule {
  question: string;
  answers: string[];
  chat: number;
  type: "often" | "daily";
  parameters: oftenScheduleParams & dailyScheduleParams;
  scheduled: Timestamp;
}
