import type { HttpContext } from '@adonisjs/core/http'
import Follow from '#models/follow'

export default class FollowsController {
    public async create({auth}:HttpContext){
    const user = auth.user!
    await Follow.create({
        
    })




    }
}