import type { HttpContext } from '@adonisjs/core/http'

export default class TweetsController {
  public async index({ view }: HttpContext) {
    return view.render('pages/tweets/create')
  }
}
