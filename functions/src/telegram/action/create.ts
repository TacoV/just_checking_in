import { Composer } from 'telegraf'
import db from '../../utils/db'
import { Timestamp } from 'firebase-admin/firestore'

export default new Composer()
  .action('create-dailycheck', async ctx =>
    Promise.all([
      db.schedules
        .add({
          question: {
            question: 'Heb je je medicijnen geslikt?',
            answers: ['Ja', 'Nee'],
          },
          chat: ctx.from.id,
          type: 'daily',
          parameters: { time: '20:00' },
          scheduled: Timestamp.fromDate(new Date()),
        }),
      ctx.reply('Reminder gezet om 20:00'),
      ctx.answerCbQuery(),
      ctx.editMessageReplyMarkup(undefined),
    ]),
  )
  .action('create-meds', async ctx =>
    Promise.all([
      db.schedules
        .add({
          question: {
            question: 'Heb je je medicijnen geslikt?',
            answers: ['Ja', 'Nee'],
          },
          chat: ctx.from.id,
          type: 'daily',
          parameters: { time: '20:00' },
          scheduled: Timestamp.fromDate(new Date()),
        }),
      ctx.reply('Dit werkt nog niet'),
      ctx.answerCbQuery(),
      ctx.editMessageReplyMarkup(undefined),
    ]),
  )
  .action('create-journalling', async ctx =>
    Promise.all([
      db.schedules
        .add({
          question: {
            question: 'Heb je je medicijnen geslikt?',
            answers: ['Ja', 'Nee'],
          },
          chat: ctx.from.id,
          type: 'daily',
          parameters: { time: '20:00' },
          scheduled: Timestamp.fromDate(new Date()),
        }),
      ctx.reply('Dit werkt nog niet'),
      ctx.answerCbQuery(),
      ctx.editMessageReplyMarkup(undefined),
    ]),
  )
  .action('create-randommeasure', async ctx =>
    Promise.all([
      db.schedules
        .add({
          question: {
            question: 'Heb je je medicijnen geslikt?',
            answers: ['Ja', 'Nee'],
          },
          chat: ctx.from.id,
          type: 'daily',
          parameters: { time: '20:00' },
          scheduled: Timestamp.fromDate(new Date()),
        }),
      ctx.reply('Dit werkt nog niet'),
      ctx.answerCbQuery(),
      ctx.editMessageReplyMarkup(undefined),
    ]),
  )
  .action('create-weekly', async ctx =>
    Promise.all([
      db.schedules
        .add({
          question: {
            question: 'Heb je je medicijnen geslikt?',
            answers: ['Ja', 'Nee'],
          },
          chat: ctx.from.id,
          type: 'daily',
          parameters: { time: '20:00' },
          scheduled: Timestamp.fromDate(new Date()),
        }),
      ctx.reply('Dit werkt nog niet'),
      ctx.answerCbQuery(),
      ctx.editMessageReplyMarkup(undefined),
    ]),
  )
