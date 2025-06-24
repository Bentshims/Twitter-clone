import type { HttpContext } from '@adonisjs/core/http'

export default class NotificationsController {
    public async index({view, auth}:HttpContext){
        const user = auth.user!
        const notifications = await user.related('notifications').query().orderBy('createdAt','desc')

        return view.render('pages/notifications',{notifications, user})
    }



}