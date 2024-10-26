import { Composer } from 'telegraf'

export default new Composer()
  .action('delete-keyboard', async ctx =>
    Promise.all([
      ctx.answerCbQuery(),
      ctx.editMessageReplyMarkup(undefined),
    ]),
  )
