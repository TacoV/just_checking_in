import { Composer, Markup } from 'telegraf'

import db from '../../utils/db'
import { dailyScheduleParams, oftenScheduleParams, schedule, weeklyScheduleParams } from '../../types/schedule'

export default new Composer()

  .command('clear', async (ctx) => {
    const mySchedules = await db.schedules
      .where('chat', '==', ctx.chat?.id)
      .get()

    const delSchedules = Promise.all(
      mySchedules.docs.map(
        doc => doc.ref.delete(),
      ),
    )

    const myQuestions = await db.questions
      .where('chat', '==', ctx.chat?.id)
      .get()

    const delQuestions = Promise.all(
      myQuestions.docs.map(
        doc => doc.ref.delete(),
      ))

    return Promise.all([delSchedules, delQuestions])
  })

  .command('list', async (ctx) => {
    const mySchedules = await db.schedules
      .where('chat', '==', ctx.chat?.id)
      .get()

    const buttons = mySchedules.docs.map(doc =>
      Markup.button.callback(
        describeShort(doc.data())
        , 'edit-' + doc.id,
      ),
    )

    return ctx.reply(
      'Pick a schedule',
      Markup.inlineKeyboard(buttons),
    )
  })

const describeShort = (schedule: schedule): string => {
  switch (schedule.type) {
    case 'often':
      return describeShortOften(schedule, schedule.parameters as oftenScheduleParams)
    case 'daily':
      return describeShortDaily(schedule, schedule.parameters as dailyScheduleParams)
    case 'weekly':
      return describeShortWeekly(schedule, schedule.parameters as weeklyScheduleParams)
  }
}

const describeShortOften = (schedule: schedule, parameters: oftenScheduleParams) => {
  return `Ask every day ${parameters.minutes} minutes: '${schedule.question.question}'`
}

const describeShortDaily = (schedule: schedule, parameters: dailyScheduleParams) => {
  return `Ask every day at ${parameters.time}: '${schedule.question.question}'`
}

const describeShortWeekly = (schedule: schedule, parameters: weeklyScheduleParams) => {
  const day = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][parameters.day]
  return `Ask every day-${day} at ${parameters.time}: '${schedule.question.question}'`
}
