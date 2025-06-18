import type { HttpContext } from '@adonisjs/core/http'
import { signupValidator, loginvalidator } from '#validators/user'
import User from '#models/user'
import Tweet from '#models/tweet'

export default class UsersController {
  public async home({view, auth} :HttpContext){
    const user = auth.user!
    const tweets = await Tweet.query().preload('user').orderBy('createdAt','desc')
    return view.render('pages/home',{user,tweets})
  }

  public async index({ view, auth }: HttpContext) {
    const user = auth.user!
    return view.render('pages/profil',{user})
  }

  public async login ({view}:HttpContext){
    return view.render('pages/security/login')
  }

  public async signup ({view}:HttpContext){
    return view.render('pages/security/signup')
  }

  public async signupUser({view, request, response, auth}:HttpContext){
    const payload = await request.validateUsing(signupValidator)
    console.log(payload);
    
    const image = request.file('profileLink')

    const imageName = `${Date.now()}.${image?.extname}`
    await image?.move('./public/images_profil',{name:imageName})

    if (!payload) {
      return response.send('Nous avons rencontrer une erreur lors de la creation du compte, veillez reesayer plutard')
    }
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
      



      
    return view.render('pages/home',{users:user})

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
