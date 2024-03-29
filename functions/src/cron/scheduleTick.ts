import {Telegraf} from "telegraf";

import {planNextQuestions} from "./planNextQuestions";
import {askedPlannedQuestions} from "./askedPlannedQuestions";

export default function scheduleTick(bot: Telegraf) {
  return () => {
    planNextQuestions();
    askedPlannedQuestions(bot);
  };
}
