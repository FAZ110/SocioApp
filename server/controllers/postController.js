const Post = require('../models/Post');
const User = require('../models/User');


const createPost = async (req, res) => {
    try {
        const {content, image} = req.body;

        const post = await Post.create({
            content,
            image: image || null,
            author: req.user._id
        });

        await post.populate('author', 'username');

        res.status(201).json({
            success: true,
            data: post
        })
        
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: 'Server error creating a post'
        });
        
    }
}


const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find()
        .populate('author', 'username bio')
        .populate('likes', 'username')
        .sort({createdAt: -1});

        res.json({
            success: true,
            count: posts.length,
            data: posts
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error getting posts'
        })
        
    }
}


const toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        const userId = req.user._id;

        const isLiked = post.likes.includes(userId);
        
        const update = isLiked 
            ? { $pull: { likes: userId } } // If liked, unlike it
            : { $addToSet: { likes: userId } }; // If not liked, like it

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            update,
            { new: true }
        ).populate('author', 'username').populate('likes', 'username');

        res.json({
            success: true,
            message: isLiked ? 'Post unliked' : 'Post liked',
            data: updatedPost
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


const getUserPosts = async (req, res) => {
    try {
        const user = await User.findOne({username: req.params.username})
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const posts = await Post.find({author: user._id})
        .populate('author', 'username')
        .populate('likes', 'username')
        .sort({createdAt: -1})

        res.json({
            success: true,
            data: posts
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
        
    }
}


const commentPost = async (req, res) => {
    try {
        const {postId} = req.params;
        const userId = req.user._id;
        const {text} = req.body;

        if (!text.trim() || text.trim().length === 0){
            return res.status(400).json({
                success: false,
                message: 'Comment text is required'
            })
        }

        if (text.trim().length > 300){
            return res.status(400).json({
                success: false,
                message: 'Comment exceeded 300 characters'
            })
        }

        const post = await Post.findById(postId)

        if(!post){
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        post.comments.push({
            user: userId,
            text: text.trim()
        })

        const updatedPost = await post.save()

        await updatedPost.populate({
            path: 'comments.user',
            select: 'username'
        })

        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            data: {
                comment: updatedPost.comments[updatedPost.comments.length-1]
            }
        })

        
    } catch (error) {
        console.error('Error adding comment: ', error)
        res.status(500).json({
            success: false,
            message: 'Server error while adding a comment'
        })
        
    }
}


const getPostComments = async (req, res) => {
    try {
        const {postId} = req.params;
        const post = await Post.findById(postId).populate({
            path: 'comments.user',
            select: 'username'
        })


        if(!post){
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        const comments = post.comments

        if (!comments || comments.length < 1){
            return res.status(200).json({
                success: true,
                message: 'No comments yet',
                data: []
            });
        }

        const sortedComments = comments.sort((a, b) => b.createdAt - a.createdAt)

        res.status(200).json({
            success: true,
            message: 'Fetching post comments is successfull',
            data: sortedComments
        })


        
    } catch (error) {
        console.error('Error fetching comments: ', error)
        res.status(500).json({
            success: false,
            message: 'Server error while fetching comments'
        })
        
    }
}

module.exports = {createPost, getFeedPosts, toggleLike, getUserPosts, commentPost, getPostComments}
