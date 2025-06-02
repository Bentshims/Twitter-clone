/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.on('/').render('pages/home')
router.resource('/tweet', '#controllers/tweets_controller')
router.resource('/users', '#controllers/users_controller')
router.get('/login','#controllers/users_controller.login')
router.get('/signup','#controllers/users_controller.signup')

router.post('/loginUser','#controllers/users_controller.loginUser')
router.post('/signupUser','#controllers/users_controller.signupUser')

