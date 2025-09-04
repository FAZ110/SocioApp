const express = require('express');
const {createPost, getFeedPosts} = require('../controllers/postController');
const {protect} = require('../middleware/auth')

const router = express.Router();
router.use(protect)

router.post('/', createPost)
router.get('/', getFeedPosts)

module.exports = router;