import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Conversation from '#models/conversation'
import Message from '#models/message'

export default class MessagesController {
  public async index({ view, auth }: HttpContext) {
    const user = auth.user!
    const newSNotification = await user
      .related('notifications')
      .query()
      .where('is_read', false)
      .count('* as total')
    const notifications = newSNotification[0].$extras.total
    const users = await User.query().whereNot('id', user.id)
    return view.render('pages/messages', { user, users, notifications, selectedConversation: null })
  }

  public async show({ view, auth, params }: HttpContext) {
    const user = auth.user!
    const otherUserId = Number(params.id)
    if (!otherUserId || otherUserId === user.id) {
      return this.index({ view, auth } as any)
    }
    let conversation = await Conversation.query()
      .where((q) => {
        q.where('user_one_id', user.id).where('user_two_id', otherUserId)
      })
      .orWhere((q) => {
        q.where('user_one_id', otherUserId).where('user_two_id', user.id)
      })
      .preload('messages', (query) => {
        query.orderBy('created_at', 'asc')
      })
      .first()
    if (!conversation) {
      conversation = await Conversation.create({ userOneId: user.id, userTwoId: otherUserId })
      conversation.messages = []
    }
    const contact = await User.findOrFail(otherUserId)
    const selectedConversation = {
      id: conversation.id,
      contact,
      messages: conversation.messages || [],
    }
    const users = await User.query().whereNot('id', user.id)
    const newSNotification = await user
      .related('notifications')
      .query()
      .where('is_read', false)
      .count('* as total')
    const notifications = newSNotification[0].$extras.total
    return view.render('pages/messages', { user, users, notifications, selectedConversation })
  }

  public async store({ request, auth, response }: HttpContext) {
    const user = auth.user!
    const conversationId = request.input('conversation_id')
    const content = request.input('content')
    if (!conversationId || !content || !content.trim()) {
      return response.redirect().back()
    }
    const conversation = await Conversation.query()
      .where('id', conversationId)
      .where((q) => {
        q.where('user_one_id', user.id).orWhere('user_two_id', user.id)
      })
      .firstOrFail()
    await Message.create({
      conversationId: conversation.id,
      senderId: user.id,
      content: content.trim(),
    })
    return response.redirect(
      `/messages/${conversation.userOneId === user.id ? conversation.userTwoId : conversation.userOneId}`
    )
  }
}
