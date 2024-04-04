import {Telegraf} from "telegraf";

import listAll from "./listAll";
import clearAll from "./clearAll";

import medsSchedule from "./medsSchedule";
import debugSchedule from "./debugSchedule";
import sleepSchedule from "./sleepSchedule";

import recordAnswer from "./recordAnswer";

export default function webhookCallback(bot: Telegraf) {
  bot.start((ctx) => ctx.reply("Yeah daar gaan we"));
  bot.help((ctx) => ctx.reply("Ik weet het ook niet, kom ik op terug"));

  bot.command("remind", medsSchedule);
  bot.command("debug", debugSchedule);
  bot.command("sleep", sleepSchedule);

  bot.command("clear", clearAll);
  bot.command("list", listAll);

  bot.use(recordAnswer);

  // Todo: list active schedules
  // Todo: delete schedules
  // Todo: edit schedules
  // Todo: see results of questions
  // Todo: set old unanswered questions to status dropped

  return bot.webhookCallback();
}
