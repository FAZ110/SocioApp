const User = require('../models/User')
const Post = require('../models/Post')


const deleteUser = async (req, res) => {
    try {
        const {username} = req.params;

        const user = await User.findOne({username})

        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User with that username does not exist'
            })
        }

        if(req.user._id.toString() === user._id.toString()){
            return res.status(400).json({
                success: false,
                message: 'Admins cannot delete their own account'
            })
        }
        await Post.deleteMany({author: user._id})

        await User.updateMany({}, {$pull:{followers: user._id, following: user._id}})

        await User.findByIdAndDelete(user._id);
        

        res.json({
            success: true,
            message: `User ${username} deleted successfully`
        })
        


        
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: 'Server error while deleting an user'
        })
        
    }
}


const listUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').populate('username', 'email').sort({createdAt: -1})

        if(users.length === 0){
            return res.status(200).json({
                success: true,
                message: "There are no users in the database",
                count: 0,
                data: []
            })
        }

        res.json({
            success: true,
            message: "Success getting all the users",
            count: users.length,
            data: users
        })
        
    } catch (error) {
        console.error("Error in listUsers: ", error)
        res.status(500).json({
            success: false,
            message: "Server error while getting users"
        })
        
    }
}

const followUser = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const targetUsername = req.params.username;

        const targetUser = await User.findOne({username: targetUsername});
        if(!targetUser){
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        if (currentUserId.toString() === targetUser._id.toString()){
            return res.status(400).json({
                success: false,
                message: 'You cannot follow yourself'
            })
        }

        const isAlreadyFollowing = req.user.following.includes(targetUser._id);

        if(isAlreadyFollowing){
            return res.status(400).json({
                success: false,
                message: `You are already following ${targetUsername}`
            })
        }

        await User.findByIdAndUpdate(currentUserId, {$addToSet:{following: targetUser._id}})

        await User.findByIdAndUpdate(targetUser._id, {$addToSet: {followers: currentUserId}})

        res.status(200).json({
            success: true,
            message: `You are now following ${targetUsername}`
        })

    } catch (error) {
        console.error("Error while trying to follow: ",error)
        res.status(500).json({
            success: false,
            message: 'Server error while following user'
        })
        
    }
}


const unfollowUser = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const targetUsername = req.params.username;

        const targetUser = await User.findOne({username: targetUsername});

        if(!targetUser){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const isFollowing = req.user.following.includes(targetUser._id)

        if(!isFollowing){
            return res.status(400).json({
                success: false,
                message: `You are not following ${targetUsername}`
            })
        }

        await User.findByIdAndUpdate(currentUserId, {$pull: {following: targetUser._id}})
        
        await User.findByIdAndUpdate(targetUser._id, {$pull: {followers: currentUserId}})

        res.status(200).json({
            success: true,
            message: `You have unfollowed ${targetUsername}`
        })
    } catch (error) {
        console.error("Error while trying to unfollow: ", error)
        res.status(500).json({
            success: false,
            message: 'Server error while unfollowing user'
        })
        
    }
}

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({username: req.params.username})
        .select('-password').populate('followers', 'username').populate('following', 'username')
        
        if (!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        res.json({
            success: true,
            data: user
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        })
        
    }

}

module.exports = {deleteUser, listUsers, followUser, unfollowUser, getUserProfile}