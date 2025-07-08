import type { HttpContext } from '@adonisjs/core/http'
import { loginvalidator } from '#validators/user'
import User from '#models/user'
import Tweet from '#models/tweet'
import { DateTime } from 'luxon'
import Like from '#models/like'
import Retweet from '#models/retweet'

export default class UsersController {
  public async home({ view, auth }: HttpContext) {
    const user = auth.user!
    // les tweets
    const tweets = await Tweet.query()
      .preload('user')
      .withCount('retweets')
      .withCount('likes')
      .withCount('comments')
      .orderBy('createdAt', 'desc')

    const retweets = await Retweet.query()
      .preload('tweet', (query) => {
        query.preload('user').withCount('likes').withCount('retweets').withCount('comments')
      })
      .preload('user')
      .orderBy('createdAt', 'desc')

    const retweetTweets = retweets.map((retweet) => {
      const tweet = retweet.tweet
      // @ts-ignore
      tweet.isRetweet = true
      // @ts-ignore
      tweet.retweetUser = retweet.user
      // @ts-ignore
      tweet.retweetedAt = retweet.createdAt

      return tweet
    })

    const tweetAll = [...tweets, ...retweetTweets]

    tweetAll.sort((a, b) => {
      // @ts-ignore
      const dateA = a.retweetedAt ?? a.createdAt
      // @ts-ignore
      const dateB = b.retweetedAt ?? b.createdAt
      return dateB.toMillis() - dateA.toMillis()
    })

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
    const newSNotification = await user
      .related('notifications')
      .query()
      .where('is_read', false)
      .count('* as total')

    const notifications = newSNotification[0].$extras.total
    // console.log('nombres des notification :',notifications);

    for (const tweet of tweetAll) {
      const like = await Like.query()
        .where('user_id', user.id)
        .andWhere('tweet_id', tweet.id)
        .first()

      // @ts-ignore
      tweet.isLike = !!like
    }

    return view.render('pages/home', { user, tweets: tweetAll, fromNow, notifications })
  }

  public async index({ view, auth }: HttpContext) {
    const user = auth.user!

    // les follows
    await user.loadCount('following')
    const followings = user.$extras.following_count
    await user.loadCount('follower')
    const followers = user.$extras.follower_count

    //les notifications
    const newSNotification = await user
      .related('notifications')
      .query()
      .where('is_read', false)
      .count('* as total')

    const notifications = newSNotification[0].$extras.total
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
    const tweets = await Tweet.query()
      .preload('user')
      .where('user_id', user.id)
      .orderBy('createdAt', 'desc')

    return view.render('pages/profil', {
      user,
      tweets,
      followings,
      followers,
      notifications,
      fromNow,
    })
  }

  public async login({ view }: HttpContext) {
    return view.render('pages/security/login')
  }

  public async signup({ view }: HttpContext) {
    return view.render('pages/security/signup')
  }

  public async signupUser({ request, response, auth }: HttpContext) {
    // console.log(request);
    const image = request.file('profileLink')
    // const payload = await request.validateUsing(signupValidator)
    const payload = request.only(['fullName', 'userName', 'email', 'password', 'birthDate', 'bio'])
    console.log(payload)

    // const image = request.file('profileLink')

    const imageName = `${Date.now()}.${image?.extname}`
    await image?.move('./public/images_profil', { name: imageName })

    if (!payload) {
      return response.send(
        'Nous avons rencontrer une erreur lors de la creation du compte, veillez reesayer plutard'
      )
    }
    if (!image?.extname || !image) {
      const user = await User.create({
        fullName: payload.fullName,
        userName: payload.userName,
        profilLink: null,
        bio: payload.bio,
        email: payload.email,
        password: payload.password,
        birthDate: payload.birthDate,
      })
      console.log(user)
      await auth.use('web').login(user)
      const authentifiedUser = auth.user!
      console.log(authentifiedUser)
    } else {
      const user = await User.create({
        fullName: payload.fullName,
        userName: payload.userName,
        profilLink: `/images_profil/${imageName}`,
        bio: payload.bio,
        email: payload.email,
        password: payload.password,
        birthDate: payload.birthDate,
      })
      console.log(user)
      await auth.use('web').login(user)
      const authentifiedUser = auth.user!
      console.log(authentifiedUser)
    }

    return response.redirect('/')
  }

  public async loginUser({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(loginvalidator)
    if (!payload) {
      return response.send("L'utilisateur n'existe pas veuille entrer les informations valide")
    }
    const { email, password } = payload
    const user = await User.verifyCredentials(email, password)
    await auth.use('web').login(user)

    return response.redirect('/')
  }
}
