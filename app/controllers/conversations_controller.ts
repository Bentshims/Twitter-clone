import type { HttpContext } from '@adonisjs/core/http'
import Conversation from '#models/conversation'
import Message from '#models/message'

export default class ConversationsController {
  public async index({ auth, request, response, view }: HttpContext) {
    const user = auth.user!
    const conversations = await Conversation.query()
      .where('user_one_id', user.id)
      .orWhere('user_two_id', user.id)
      .preload('messages', (query) => {
        query.orderBy('created_at', 'desc').limit(1)
      })
      .preload('userOne')
      .preload('userTwo')
      .orderBy('updated_at', 'desc')

    if (request.ajax()) {
      return response.json(conversations)
    }

    return view.render('pages/messages', { conversations, user })
  }

  public async show({ params, auth, request, response }: HttpContext) {
    const user = auth.user!
    const conversation = await Conversation.query()
      .where('id', params.id)
      .where((q) => {
        q.where('user_one_id', user.id).orWhere('user_two_id', user.id)
      })
      .preload('messages', (query) => {
        query.orderBy('created_at', 'asc').preload('sender')
      })
      .firstOrFail()

    if (request.ajax()) {
      return response.json(conversation)
    }

    return response.json(conversation)
  }

  public async create({ request, auth, response }: HttpContext) {
    const user = auth.user!
    const recipientId = request.input('recipient_id')
    const content = request.input('content')

    let conversation = await Conversation.query()
      .where((q) => {
        q.where('user_one_id', user.id).where('user_two_id', recipientId)
      })
      .orWhere((q) => {
        q.where('user_one_id', recipientId).where('user_two_id', user.id)
      })
      .first()

    if (!conversation) {
      conversation = await Conversation.create({
        userOneId: user.id,
        userTwoId: recipientId,
      })
    }

    await Message.create({
      conversationId: conversation.id,
      senderId: user.id,
      content,
    })

    return response.redirect('/messages')
  }
}
