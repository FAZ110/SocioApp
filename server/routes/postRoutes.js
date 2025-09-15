const express = require('express');
const {createPost, getFeedPosts, toggleLike, getUserPosts, commentPost, getPostComments} = require('../controllers/postController');
const {protect, admin} = require('../middleware/auth')

const router = express.Router();
router.use(protect)

router.post('/', createPost)
router.get('/', getFeedPosts)
router.post('/:postId/comment', commentPost)
router.get('/:postId/comments', getPostComments)

router.post('/:postId/toggleLike', toggleLike);
router.get('/user/:username', getUserPosts)

module.exports = router;