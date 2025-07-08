import type { HttpContext } from '@adonisjs/core/http'

export default class MessagesController {
    public async index({ view }: HttpContext) {
        return view.render('pages/messages')
    }
}