const {authorize} = require('../middleware/auth')
const {createChat, fetchAllChats, createGroup, renameGroup, addToGroup, removeFromGroup} = require('../controllers/chatControllers')
const router = require('express').Router()

router.route('/').post(authorize, createChat).get(authorize, fetchAllChats)
router.route('/group-create').post(authorize, createGroup)
router.route('/group-rename').put(authorize, renameGroup)
router.route('/group-add-member').put(authorize, addToGroup)
router.route('/group-remove-member').put(authorize, removeFromGroup)

module.exports = router