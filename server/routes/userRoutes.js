const express = require('express');
const {protect, admin} = require('../middleware/auth');
const {deleteUser, listUsers, followUser, unfollowUser} = require('../controllers/userController');

const router = express.Router()

router.use(protect)

router.post('/:username/follow', followUser)
router.post('/:username/unfollow', unfollowUser)

router.get('/', admin, listUsers)
router.delete('/:username', admin, deleteUser)


module.exports = router;