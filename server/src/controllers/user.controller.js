const User = require('../models/User.model');
const Role = require("../models/Role.model");

const createUser = async (req, res, next) => {
    try {
        const emailExists = await User.findOne({ email: req.validatedData.email });
        if (emailExists) {
            return res.status(409).json({
                status: 'error',
                message: 'Email not available. Already in use'
            });
        }

        const roleExists = await Role.findOne({ _id: req.validatedData.role })
        if (!roleExists) return res.status(404).json({
            status: 'error',
            message: 'Role doesn\'t exists'
        })

        const user = new User({ ...req.validatedData, created_by: req?.user._id ?? null, updated_by: req?.user._id ?? null });
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

        // Direct children
        const level1Ids = [req.user._id];

        // Children of logged-in user
        const level2Users = await User.find({ created_by: req.user._id }, { _id: 1 }).lean();
        const level2Ids = level2Users.map(u => u._id);

        // Children of those children
        const level3Users = await User.find({ created_by: { $in: level2Ids } }, { _id: 1 }).lean();
        const level3Ids = level3Users.map(u => u._id);

        const allowedIds = [...level1Ids, ...level2Ids, ...level3Ids];
        const query = { _id: { $in: allowedIds } };
        if (name) query.name = { $regex: name, $options: 'i' };
        if (email) query.email = { $regex: email, $options: 'i' };
        if (role) query.role = Array.isArray(role) ? { $in: role } : role;

        const users = await User.find(query)
            .populate("role", "name")
            .select('-password')
            .skip((pageNo - 1) * itemsPerPage)
            .limit(parseInt(itemsPerPage));

        const total = await User.countDocuments(query);

        return res.status(200).json({
            status: 'success',
            message: 'Users retrieved',
            users,
            pagination: {
                total,
                pageNo: Number(pageNo),
                itemsPerPage: Number(itemsPerPage)
            }
        });
    } catch (error) {
        next(error);
    }
};


const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password').populate("role", "name");
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

        const isSelfUpdate = req.user._id.toString() === id;
        const isAdmin = req.user.role?.name === 'admin';

        if (!isAdmin && !isSelfUpdate) {
            return res.status(403).json({
                status: 'error',
                message: 'Forbidden: Cannot update other users'
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        const { email, password, role, ...otherData } = req.validatedData;

        if (email) {
            const isEmailPresent = await User.findOne({ email, _id: { $ne: id } });
            if (isEmailPresent) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email already in use'
                });
            }
            user.email = email;
        }

        if (role) {
            if (!isAdmin) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Forbidden: Only admins can change roles'
                });
            }

            const isRolePresent = await Role.findById(role);
            if (!isRolePresent) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Role not found'
                });
            }
            user.role = role;
        }

        if (password) {
            user.password = password;
        }

        Object.assign(user, otherData, { updated_by: req?.user._id ?? null });

        const updatedUser = await user.save();
        const { password: _, ...userWithoutPassword } = updatedUser.toObject();

        return res.status(200).json({
            status: 'success',
            message: 'User updated',
            user: userWithoutPassword
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

        const isSelfDelete = req.user._id.toString() === id;
        const isAdmin = req.user.role?.name === 'admin';

        const targetUser = await User.findById(id);
        if (!targetUser) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        const isCreator = targetUser.created_by?.toString() === req.user._id.toString();

        if (!isAdmin && !isSelfDelete && !isCreator) {
            return res.status(403).json({
                status: 'error',
                message: 'Forbidden: Cannot delete this user'
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