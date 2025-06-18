import type { HttpContext } from '@adonisjs/core/http'
import Tweet from '#models/tweet'
import User from '#models/user'
import { DateTime } from 'luxon'


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


  public async profil({view,params}:HttpContext){
    const user = await User.findByOrFail('userName', params.userName)
    return view.render('pages/profil',{user})
  }



















}
