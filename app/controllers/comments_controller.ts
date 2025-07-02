import type { HttpContext } from '@adonisjs/core/http'
import Comment from '#models/comment'
import { commentValidator } from '#validators/comment'

export default class CommentsController {
    public async create({ request, auth, params, response }: HttpContext) {
        const user = auth.user!
        const tweetId = params.id
        const { content } = await request.validateUsing(commentValidator)

        if (!content || content.trim() === '') {
          return response.redirect().back()
        }
      
        await Comment.create({
          userId: user.id,
          tweetId,
          content,
        })
      
        return response.redirect().back()
    }
      
}