import type { HttpContext } from '@adonisjs/core/http'
import Tweet from '#models/tweet'
import Retweet from '#models/retweet'

export default class RetweetsController {

    public async index({ auth, params, request, response }: HttpContext) {
        const user = auth.user!
        const tweet = await Tweet.findOrFail(params.id)
        const comment = request.input('comment') || null
    
        const existingRetweet = await Retweet
          .query()
          .where('user_id', user.id)
          .andWhere('tweet_id', tweet.id)
          .first()
    
        if (existingRetweet) {
          await existingRetweet.delete()
        } else {
          const retweet = await Retweet.create({
            userId: user.id,
            tweetId: tweet.id,
            comment,
          })
          console.log(retweet);
          
        }
    
        return response.redirect().back()
      }

}