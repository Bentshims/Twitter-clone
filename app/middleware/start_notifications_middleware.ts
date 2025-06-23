import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import User from '#models/user'


export default class StartNotificationsMiddleware {
  async handle(ctx: HttpContext, next: NextFn,) {
    /**
     * Middleware logic goes here (before the next call)
     */
    console.log(ctx)
    if (ctx.auth.user) {
      // On récupère l'id de l'utilisateur connecté
      const userId = ctx.auth.user.id

      // Charge l'utilisateur complet avec Lucid
      const user = await User.findOrFail(userId)

      const newSNotification = await user.related('notifications')
        .query()
        .where('is_read', false)
        .count('* as total')

      const notifications = newSNotification[0].$extras.total

      console.log('nombres des notification :', notifications)

      ctx.view.share({
        notifications
      })
    }
    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
} 