const Post = require('../models/Post');


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

module.exports = {createPost, getFeedPosts}
