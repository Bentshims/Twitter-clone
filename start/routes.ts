/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.get('/login','#controllers/users_controller.login')
router.get('/signup','#controllers/users_controller.signup')
router.post('/signupUser','#controllers/users_controller.signupUser')
router.post('/loginUser','#controllers/users_controller.loginUser')

router.group(
    ()=>{
        router.get('/',"#controllers/users_controller.home")
        router.get('/profil', '#controllers/users_controller.index')
        router.post('/tweet/create', '#controllers/tweets_controller.create')
        router.get('/notifications', '#controllers/notifications_controller.index')
        router.post('/follow/addOrDelete/:id','#controllers/follows_controller.followOrUnfollow')
        router.get('/profil/:userName','#controllers/tweets_controller.profil')
    }
).use(middleware.auth())


