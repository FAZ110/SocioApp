const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token){
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access'
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.userId).select('-password');

        if(!req.user){
            return res.status(401).json({
                success: false,
                message: 'Not authorized, user not found'
            })
        }

        next()
        
    } catch (error) {
        console.error('Auth middleware error: ', error);
        return req.status(401).json({
            success: false,
            message: 'Not authorized. Token failed'
        })
        
    }
}

const admin = (req, res, next) => {
    if(req.user && req.user.isAdmin){
        next()
    }else{
        res.status(403).json({
            success: false,
            message: 'Not authorized as admin'
        })
    }
}

module.exports = {protect, admin}