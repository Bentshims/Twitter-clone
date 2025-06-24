import type { HttpContext } from '@adonisjs/core/http'
import Notification from '#models/notification'

export default class FollowsController {
    public async followOrUnfollow({auth,params, response}:HttpContext){
        const user = auth.user!
        const followId = params.id

        if(user.id === Number(followId)){
            return response.badRequest('Desolé vous ne pouvez pas vous suivre vous-même')
        }
        const isFollow =  await user.related('following').query().where('users.id',followId).first()
        if (isFollow) {
            await user.related('following').detach([followId])
            await Notification.create({
                userId: followId,
                content:`${user.userName} ne vous suit plus`,
                type: `unfollow`
            })

        } else {
            await user.related('following').attach([followId])
            await Notification.create({
                userId: followId,
                content: `${user.userName} vous suit `,
                type:`follow`
            })
            
           
        }

        return response.redirect().back()
    }

}