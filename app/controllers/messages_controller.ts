import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Conversation from '#models/conversation'
import Message from '#models/message'

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
        return view.render('pages/messages', { user, users, notifications, selectedConversation: null })
    }

    // Affiche la conversation avec un utilisateur donné (ou la crée si elle n'existe pas)
    public async show({ view, auth, params }: HttpContext) {
        const user = auth.user!
        const otherUserId = Number(params.id)
        if (!otherUserId || otherUserId === user.id) {
            // Redirige ou affiche la vue sans conversation sélectionnée
            return this.index({ view, auth } as any)
        }
        // Cherche la conversation existante
        let conversation = await Conversation.query()
            .where(q => {
                q.where('user_one_id', user.id).where('user_two_id', otherUserId)
            })
            .orWhere(q => {
                q.where('user_one_id', otherUserId).where('user_two_id', user.id)
            })
            .preload('messages', (query) => {
                query.orderBy('created_at', 'asc')
            })
            .first()
        // Si pas de conversation, crée-la
        if (!conversation) {
            conversation = await Conversation.create({ userOneId: user.id, userTwoId: otherUserId })
            conversation.messages = []
        }
        // Récupère l'utilisateur contact
        const contact = await User.findOrFail(otherUserId)
        // Structure pour la vue
        const selectedConversation = {
            id: conversation.id,
            contact,
            messages: conversation.messages || []
        }
        // Liste des autres utilisateurs (pour contacts)
        const users = await User.query().whereNot('id', user.id)
        // Notifications non lues
        const newSNotification = await user
            .related('notifications')
            .query()
            .where('is_read', false)
            .count('* as total')
        const notifications = newSNotification[0].$extras.total
        return view.render('pages/messages', { user, users, notifications, selectedConversation })
    }
}