import { Telegraf } from 'telegraf'

import scheduleCommands from './command/scheduleCommands'
import adminCommands from './command/adminCommands'
import recordAnswers from './action/recordAnswers'
import start from './command/start'
import create from './action/create'
import deletekeyboard from './action/deletekeyboard'

export default (bot: Telegraf) => {
  bot.use(start)
  bot.help((ctx) => {
    return ctx.reply('Ik weet het ook niet, kom ik op terug')
  })

  bot.use(scheduleCommands)
  bot.use(adminCommands)
  bot.use(recordAnswers)
  bot.use(create)
  bot.use(deletekeyboard)

  // Todo: edit schedules
  // Todo: see results of questions

  return bot.webhookCallback()
}
