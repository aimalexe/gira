const User = require('../models/User.model');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { email, password } = req.validatedData;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid email or password'
        });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid email or password'
        });
    }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
    const bearerToken = `Bearer ${token}`;
    res.cookie('authorization', bearerToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(200).json({
        status: 'success',
        data: { id: user._id, role: user.role, token: bearerToken }
    });
};

const logout = async (req, res) => {
    res.cookie('authorization', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully'
    });
};

module.exports = { login, logout };