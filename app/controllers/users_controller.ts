import type { HttpContext } from '@adonisjs/core/http'
import { signupValidator, loginvalidator } from '#validators/user'
import User from '#models/user'
import { messages } from '@vinejs/vine/defaults'
import auth from '@adonisjs/auth/services/main'

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

  public async signupUser({request, response}:HttpContext){
    const payload = await request.validateUsing(signupValidator)
    if (!payload) {
      return response.send('Nous avons rencontrer une erreur lors de la creation du compte, veillez reesayer plutard')
    } else {

      await User.create({
        fullName : payload.fullName,
        email : payload.email,
        password : payload.password
      })
    return response.redirect('/')
    }
  }

  public async loginUser({request, response, auth}:HttpContext){
    const payload = await request.validateUsing(loginvalidator)
    if (!payload) {
      return response.send("L'utilisateur n'existe pas veuille entrer les informations valide")
    } else {
      const {email, password} = payload
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)

      return response.redirect('/')
    }
  }
}
