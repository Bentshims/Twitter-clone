import type { HttpContext } from '@adonisjs/core/http'
import Tweet from '#models/tweet'


export default class TweetsController {
  public async create({ response, auth, request}: HttpContext) {
    const tweet = request.all()
    const user = auth.user!

    await Tweet.create({
      userId : user.id,
      content : tweet.content,
      media : tweet.media
    })
    

    return response.redirect().back()
  }



















}
