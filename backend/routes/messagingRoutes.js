const router = require('express').Router()
const { authorize } = require('../middleware/auth')
const {sendMessage, fetchAllMessages} = require('../controllers/messageControllers')

router.route('/').post(authorize, sendMessage)
router.route('/:chatId').get(authorize, fetchAllMessages)

module.exports = router