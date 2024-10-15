import { Composer } from 'telegraf'

import db from '../utils/db'

const composer = new Composer()

composer.command('clear', async (ctx) => {
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

composer.command('list', async (ctx) => {
  const mySchedules = await db.schedules
    .where('chat', '==', ctx.chat?.id)
    .get()

  return Promise.all(
    mySchedules.docs.map((doc) => {
      return ctx.reply(
        `Schema ${doc.data().type}, vraag: `
        + doc.data().question.question,
      )
    }),
  )
})

export default composer
