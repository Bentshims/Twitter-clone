import type { HttpContext } from '@adonisjs/core/http'
import Tweet from '#models/tweet'


export default class TweetsController {
  public async create({ response, auth, request}: HttpContext) {
    const payload = request.all()
    const user = auth.user!

    const tweet = await Tweet.create({
      userId : user.id,
      content : payload.content,
      media : payload.media
    })
    
    console.log(tweet);
    

    return response.redirect().back()
  }



















}
