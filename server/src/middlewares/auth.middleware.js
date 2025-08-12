const User = require('../models/User.model');
const jwt = require('jsonwebtoken');

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

    const user = await User.findById(decoded.id)
        .populate({
            path: 'role',
            populate: {
                path: 'permissions',
                select: 'name'
            }
        });
    if (!user) throw new Error('User not found');

    return user;
};

// Authenticate middleware
const authenticateUser = async (req, res, next) => {
    try {
        req.user = await getAuthenticatedUser(req);
        next();
    } catch (err) {
        next(err);
    }
};

/**
 * Authorize by either role name(s) OR permission name(s)
 * @param {Object} options - { roles?: string[], permissions?: string[] }
 */
const authorize = ({ roles = [], permissions = [] } = {}) => {
    return async (req, res, next) => {
        try {
            const user = await getAuthenticatedUser(req);
            
            if (roles.length && !roles.includes(user.role.name)) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied for role: ${user.role.name}`
                });
            }
            
            if (permissions.length) {
                const userPermissions = user.role.permissions.map(p => p.name);
                const hasPermission = permissions.every(p => userPermissions.includes(p));
                if (!hasPermission) {
                    return res.status(403).json({
                        success: false,
                        message: `Missing required permissions`
                    });
                }
            }
            
            req.user = user;
            next();
        } catch (err) {
            next(err);
        }
    };
};

module.exports = { authenticateUser, authorize };
