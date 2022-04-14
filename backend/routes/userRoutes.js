const {registerUser, authUser, getUsers} = require('../controllers/userControllers')
const {authorize} = require('../middleware/auth')
const router = require('express').Router()


router.route('/').post(registerUser).get(authorize,getUsers)
router.route('/login').post(authUser)

module.exports = router