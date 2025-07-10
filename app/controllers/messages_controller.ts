import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class MessagesController {
    public async index({ view, auth }: HttpContext) {
        const user = auth.user!
        // Notifications non lues
        const newSNotification = await user
            .related('notifications')
            .query()
            .where('is_read', false)
            .count('* as total')
        const notifications = newSNotification[0].$extras.total
        // Liste des autres utilisateurs (pour contacts)
        const users = await User.query().whereNot('id', user.id)
        return view.render('pages/messages', { user, users, notifications })
    }
}