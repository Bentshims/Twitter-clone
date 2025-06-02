import type { HttpContext } from '@adonisjs/core/http'
import { signupValidator, loginvalidator } from '#validators/user'
import User from '#models/user'

export default class UsersController {
  public async index({ view }: HttpContext) {
    return view.render('pages/profil')
  }

  public async login ({view}:HttpContext){
    return view.render('pages/security/login')
  }

  public async signup ({view}:HttpContext){
    return view.render('pages/security/signup')
  }

  public async signupUser({view}:HttpContext){

    return view.render('pages/home')
  }

  public async loginUser({view}:HttpContext){
    return view.render('pages/home')
  }
}
