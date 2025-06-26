import type { HttpContext } from '@adonisjs/core/http'
import { signupValidator, loginvalidator } from '#validators/user'
import User from '#models/user'
import Tweet from '#models/tweet'
import { DateTime } from 'luxon'

export default class UsersController {
  public async home({view, auth} :HttpContext){
    const user = auth.user!
    // les tweets
    const tweets = await Tweet.query().preload('user').orderBy('createdAt','desc')

    function fromNow(date: DateTime): string {
      const now = DateTime.now()
      const diff = now.diff(date, ['years', 'months', 'days', 'hours', 'minutes']).toObject()
    
      if (diff.years! >= 1) {
        return `${Math.floor(diff.years!)} an${Math.floor(diff.years!) > 1 ? 's' : ''}`
      }
      if (diff.months! >= 1) {
        return `${Math.floor(diff.months!)} mois`
      }
      if (diff.days! >= 1) {
        return `${Math.floor(diff.days!)} j`
      }
      if (diff.hours! >= 1) {
        return `${Math.floor(diff.hours!)} h`
      }
      if (diff.minutes! >= 1) {
        return `${Math.floor(diff.minutes!)} min`
      }
    
      return 'à l’instant'
    }
    
    //les notifications
    const newSNotification = await user.related('notifications')
    .query()
    .where('is_read', false)
    .count('* as total')

    const notifications = newSNotification[0].$extras.total
    // console.log('nombres des notification :',notifications);
    
    return view.render('pages/home',{user, tweets, fromNow, notifications})
  }

  public async index({ view, auth }: HttpContext) {
    const user = auth.user!

      // les follows
      await user.loadCount('following')
      const followings = user.$extras.following_count
      await user.loadCount('follower')
      const followers = user.$extras.follower_count

    //les notifications
    const newSNotification = await user.related('notifications')
    .query()
    .where('is_read', false)
    .count('* as total')

    const notifications = newSNotification[0].$extras.total
    // console.log('nombres des notification :',notifications);
    
    return view.render('pages/profil',{user, followings, followers, notifications})
  }

  public async login ({view}:HttpContext){
    return view.render('pages/security/login')
  }

  public async signup ({view}:HttpContext){
    return view.render('pages/security/signup')
  }

  public async signupUser({request, response, auth}:HttpContext){
    const payload = await request.validateUsing(signupValidator)
    // console.log(payload);
    
    const image = request.file('profileLink')

    const imageName = `${Date.now()}.${image?.extname}`
    await image?.move('./public/images_profil',{name:imageName})

    if (!payload) {
      return response.send('Nous avons rencontrer une erreur lors de la creation du compte, veillez reesayer plutard')
    }
    if (!image?.extname || !image) {

      const user = await User.create({
        fullName : payload.fullName,
        userName  : payload.userName,
        profilLink : null,
        bio : payload.bio,
        email : payload.email,
        password : payload.password,
        birthDate : payload.birthDate,
       

      })
      console.log(user);
      await auth.use('web').login(user)
      const authentifiedUser = auth.user!
      console.log(authentifiedUser);



      
    } else {
      const user = await User.create({
        fullName : payload.fullName,
        userName  : payload.userName,
        profilLink : `/images_profil/${imageName}`,
        bio : payload.bio,
        email : payload.email,
        password : payload.password,
        birthDate : payload.birthDate,
       

      })
      console.log(user);
      await auth.use('web').login(user)
      const authentifiedUser = auth.user!
      console.log(authentifiedUser);

    }

    return response.redirect('/')
  }

  public async loginUser({request, response, auth}:HttpContext){

    const payload = await request.validateUsing(loginvalidator)
    if (!payload) {
      return response.send("L'utilisateur n'existe pas veuille entrer les informations valide")
    }
      const {email, password} = payload
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)

      return response.redirect('/')
  }

  

}
