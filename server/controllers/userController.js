const User = require('../models/User')


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

module.exports = {deleteUser}