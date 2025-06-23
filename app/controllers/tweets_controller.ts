import type { HttpContext } from '@adonisjs/core/http'
import Tweet from '#models/tweet'
import User from '#models/user'
import Notification from '#models/notification'


export default class TweetsController {
  public async create({ response, auth, request}: HttpContext) {
    const payload = request.only(['content'])
    const media = request.file('media',{
      size: '10mb',
      extnames: ['jpg', 'png', 'jpeg', 'mp4', 'webm', 'mov'],
    })
    const user = auth.user!

    const mediaName = `${Date.now()}.${media?.extname}`
    await media?.move('./public/tweets',{name:mediaName})

    if (media) {
      const tweet = await Tweet.create({
        userId : user.id,
        content : payload.content,
        media : `/tweets/${mediaName}`
        
      })
      
      console.log(tweet)
      
  
      return response.redirect().back()
    } else {
      const tweet = await Tweet.create({
        userId : user.id,
        content : payload.content,
        media : null
        
      })
      
      console.log(tweet);
      
  
      return response.redirect().back()
    }
  }


  public async profil({view,params, auth}:HttpContext){
    const user = await User.findByOrFail('userName', params.userName)
    const authUser = auth.user!

   

      // les follows
      await user.loadCount('following')
      await user.loadCount('follower')

      const followings = user.$extras.following_count
      const followers = user.$extras.follower_count

    
    const isFollow = await authUser.related('following')
      .query()
      .where('users.id', user.id)
      .first()

    //les notifications
    const newSNotification = await authUser.related('notifications')
    .query()
    .where('is_read', false)
    .count('* as total')

    const notifications = newSNotification[0].$extras.total
    console.log('nombres des notification :',notifications);
      

    if (user.id === authUser.id) {
      return view.render('pages/profil',{user, followers, followings, notifications})
    }else{

      await Notification.create({
        userId: user.id,
        content: `${authUser.userName} a consulté votre profile`,
        type: `profil visit`
      })
      return view.render('pages/profil-tweet',{user, followers, followings, isFollowing:!!isFollow, notifications})
    }


  }



















}
