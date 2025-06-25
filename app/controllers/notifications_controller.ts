import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Notification from '#models/notification'

export default class NotificationsController {
    public async index({view, auth}:HttpContext){
        const user = auth.user!
        const notifications = await user.related('notifications').query().orderBy('createdAt','desc')
        function fromNow(date: DateTime): string {
              const now = DateTime.now()
              const diff = now.diff(date, ['years', 'months', 'days', 'hours', 'minutes', 'seconds']).toObject()
        
              if (diff.minutes! < 1) return 'à l’instant'
              if (diff.minutes! < 60) return `${Math.floor(diff.minutes!)} min`
              if (diff.hours! < 24) return `${Math.floor(diff.hours!)} h`
              if (diff.days! < 7) return `${Math.floor(diff.days!)} j`
              if (diff.days! < 30) return `${Math.floor(diff.days! / 7)} sem`
              if (diff.months! < 12) return `${Math.floor(diff.months!)} mois`
              return `${Math.floor(diff.years!)} an`
        }

        for (const notification of notifications) {
            notification.isRead = true
            await notification.save()
        }

        return view.render('pages/notifications',{notifications, user, fromNow})
    }

    public async destroy({response, params}:HttpContext){
        const notification = await Notification.findOrFail(params.id)
        await notification.delete()
        return response.redirect().back()
    }


}