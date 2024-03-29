import {Timestamp} from "firebase-admin/firestore";

export interface question {
      status: "planned" | "askes" | "answered" | "dropped",
      timing: Timestamp,
      question: string
      answers: string[]
      chat: number
    }
