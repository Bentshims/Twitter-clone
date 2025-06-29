import Like from '#models/like'
import Tweet from '#models/tweet'
import type { HttpContext } from '@adonisjs/core/http'

export default class LikesController {

    public async create({params, auth, response}:HttpContext){
        const tweet = await Tweet.findOrFail(params.id) 
        const user = auth.user!
        const isLike = await Like.query().where('user_id', user.id).andWhere('tweet_id',tweet.id).first()

        if (isLike) {
            await isLike.delete()
        }else{
            await Like.create({
                userId: user.id,
                tweetId: tweet.id

            })
        }

        return response.redirect().back()

    }
}