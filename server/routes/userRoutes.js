const express = require('express');
const {protect, admin} = require('../middleware/auth');
const {deleteUser} = require('../controllers/userController');

const router = express.Router()

router.use(protect)

router.delete('/:username', admin, deleteUser)

module.exports = router;