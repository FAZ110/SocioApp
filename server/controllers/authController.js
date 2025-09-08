const User = require('../models/User');
const jwt = require('jsonwebtoken')

const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '7d'});
};

const registerUser = async (req, res) => {
    try {
        const {username, email, password} = req.body;

        const existingUser = await User.findOne({
            $or: [{email}, {username}]
        })

        if (existingUser){
            return res.status(400).json({
                success: false,
                message: 'User with this email or username already exists'
            });
        }

        const user = await User.create({
            username,
            email,
            password,
            bio: req.body.bio || ''
        })


        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    bio: user.bio
                },
                token
            },
            

        })
        
    } catch (error) {
        console.error("Failed to register a user: ", error)
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
        
    }
};

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email}).select('+password');

        if(!user){
            return res.status(401).json({
                success: false,
                message: 'Invalid email'
            });
        }

        const isPasswordValid = await user.comparePassword(password);

        if(!isPasswordValid){
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
        }

        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    bio: user.bio
                },
                token
            }
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        })
        
    }
};



module.exports = {
    registerUser,
    loginUser
};