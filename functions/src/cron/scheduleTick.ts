import { Telegraf } from 'telegraf'

import { planNextQuestions } from './planNextQuestions'
import { askedPlannedQuestions } from './askedPlannedQuestions'

export default function scheduleTick(bot: Telegraf) {
  return async () => {
    await planNextQuestions()
    await askedPlannedQuestions(bot)
  // Todo: set old unanswered questions to status dropped
  }
}
