const User = require('../models/User.model');
const jwt = require('jsonwebtoken');

/**
 * Internal helper to extract and validate user from token
 */
const getAuthenticatedUser = async (req) => {
    const authHeader = req.cookies.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer '))
        throw new Error('Authentication token missing. Login first');

    const token = authHeader.split(' ')[1];
    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        throw new Error('Invalid or expired token. Please login');
    }

    const user = await User.findById(decoded.id);
    if (!user) throw new Error('User not found');

    return user;
};

/**
 * Middleware to authenticate any user
 */
const authenticateUser = async (req, res, next) => {
    try {
        req.user = await getAuthenticatedUser(req);
        next();
    } catch (err) {
        next(err);
    }
};

/**
 * Middleware to authenticate and authorize by roles
 * @param  {...string} allowedRoles
 */
const allowRoles = (...allowedRoles) => async (req, res, next) => {
    try {
        const user = await getAuthenticatedUser(req);

        if (allowedRoles.length && !allowedRoles.includes(user.role))
            return res.status(403).json({
                success: false,
                message: `Access denied for role: ${user.role}`
            })

        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = { authenticateUser, allowRoles };