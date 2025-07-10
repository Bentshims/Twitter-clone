import type { HttpContext } from '@adonisjs/core/http'
import Conversation from '#models/conversation'
import Message from '#models/message'
import User from '#models/user'

export default class ConversationsController {
  // Liste des conversations de l'utilisateur connecté
  public async index({ auth, request, response, view }: HttpContext) {
    const user = auth.user!
    // Récupère toutes les conversations où l'utilisateur est participant
    const conversations = await Conversation
      .query()
      .where('user_one_id', user.id)
      .orWhere('user_two_id', user.id)
      .preload('messages', (query) => {
        query.orderBy('created_at', 'desc').limit(1) // dernier message
      })
      .preload('userOne')
      .preload('userTwo')
      .orderBy('updated_at', 'desc')

    // Si AJAX, retourne JSON
    if (request.ajax()) {
      return response.json(conversations)
    }

    // Sinon, vue Edge
    return view.render('pages/messages', { conversations, user })
  }

  // Affiche les messages d'une conversation
  public async show({ params, auth, request, response }: HttpContext) {
    const user = auth.user!
    const conversation = await Conversation
      .query()
      .where('id', params.id)
      .where(q => {
        q.where('user_one_id', user.id).orWhere('user_two_id', user.id)
      })
      .preload('messages', (query) => {
        query.orderBy('created_at', 'asc').preload('sender')
      })
      .firstOrFail()

    if (request.ajax()) {
      return response.json(conversation)
    }

    // (optionnel) sinon, redirige ou affiche une vue
    return response.json(conversation)
  }
}