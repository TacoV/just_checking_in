import {Timestamp} from "firebase-admin/firestore";

export interface abstractQuestion {
      question: string
      answers: string[]
    }

export interface question {
      status: "planned" | "asked" | "answered" | "dropped",
      timing: Timestamp,
      question: abstractQuestion
      chat: number
      answer: string | undefined | null
    }
