import { Composer, Markup } from 'telegraf'

export default new Composer()
  .start(async (ctx) => {
    const pre = 'create-'
    const buttons = [
      [Markup.button.callback('Dagelijks multiple-choice check-in hoe je dag gaat', `${pre}dailycheck`)],
      [Markup.button.callback('Reminder op vast moment om medicijnen te nemen', `${pre}meds`)],
      [Markup.button.callback('Journalling prompt', `${pre}journalling`)],
      [Markup.button.callback('Random meting van je stress', `${pre}randommeasure`)],
      [Markup.button.callback('Wekelijkse reminder te sportern', `${pre}weekly`)],
      [Markup.button.callback('Nu niks, wellicht later', `delete-keyboard`)],
    ]
    return ctx.reply(
      'Welkom, wat wil je bijhouden?',
      Markup.inlineKeyboard(buttons),
    )
  })
// Action add-default-
