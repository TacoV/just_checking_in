import { Telegraf } from 'telegraf'

import scheduleCommands from './scheduleCommands'
import adminCommands from './adminCommands'
import recordAnswers from './recordAnswers'

export default (bot: Telegraf) => {
  bot.start((ctx) => {
    return ctx.reply('Yeah daar gaan we')
  })
  bot.help((ctx) => {
    return ctx.reply('Ik weet het ook niet, kom ik op terug')
  })

  bot.use(scheduleCommands)
  bot.use(adminCommands)
  bot.use(recordAnswers)

  // Todo: edit schedules
  // Todo: see results of questions
  // Todo: set old unanswered questions to status dropped

  return bot.webhookCallback()
}
