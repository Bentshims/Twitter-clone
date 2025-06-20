import type { HttpContext } from '@adonisjs/core/http'
import Follow from '#models/follow'

export default class FollowsController {
    public async followOrUnfollow({auth,params, response}:HttpContext){
        const user = auth.user!
        const followId = params.id

        if(user.id === Number(followId)){
            return response.badRequest('Desolé vous ne pouvez pas vous suivre vous-même')
        }
        const isFollow =  await user.related('following').query().where('id',followId).first()
        if (isFollow) {
            await user.related('following').detach([followId])
        } else {
            await user.related('following').attach([followId])
        }

        return response.redirect().back()
    }

}