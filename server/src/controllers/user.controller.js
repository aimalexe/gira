const User = require('../models/User.model');

const createUser = async (req, res, next) => {
    try {
        const exist = await User.findOne({ email: req.validatedData.email });
        if (exist) {
            return res.status(409).json({
                status: 'error',
                message: 'Email not available. Already in use'
            });
        }

        const user = new User({ ...req.validatedData, created_by: /* req?.user._id ?? */ null, updated_by: /* req?.user._id ?? */ null });
        await user.save();
        return res.status(201).json({
            status: 'success',
            message: 'User created',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const { name, email, role, pageNo = 1, itemsPerPage = 20 } = req.validatedQuery || req.query;
        const query = {};
        if (name) query.name = { $regex: name, $options: 'i' };
        if (email) query.email = { $regex: email, $options: 'i' };
        if (role) query.role = Array.isArray(role) ? { $in: role } : role;

        const users = await User.find(query)
            .select('-password')
            .skip((pageNo - 1) * itemsPerPage)
            .limit(parseInt(itemsPerPage));
        const total = await User.countDocuments(query);

        return res.status(200).json({
            status: 'success',
            message: 'Users retrieved',
            users,
            total,
            pageNo,
            itemsPerPage
        });
    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'User retrieved',
            user
        });
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        /* if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
            return res.status(403).json({
                status: 'error',
                message: 'Forbidden: Cannot delete other users'
            });
        } */

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        const { email } = req.validatedData;
        if (email) {
            const isEmailPresent = await User.findOne({ email, _id: { $ne: id } });
            if (isEmailPresent) return res.status(404).json({
                status: 'error',
                message: 'Email already in use'
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { ...req.validatedData, updated_by: /* req.user._id ?? */  null },
            { new: true, runValidators: true }
        ).select('-password');

        return res.status(200).json({
            status: 'success',
            message: 'User updated',
            user: updatedUser
        });
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                status: 'error',
                message: 'User ID is required for deletion'
            });
        }

        /* if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
            return res.status(403).json({
                status: 'error',
                message: 'Forbidden: Cannot delete other users'
            });
        } */

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        await User.findByIdAndDelete(id);
        return res.status(200).json({
            status: 'success',
            message: 'User deleted'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};