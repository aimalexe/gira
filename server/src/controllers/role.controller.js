const Role = require('../models/Role.model');

const createRole = async (req, res) => {
    const exists = await Role.findOne({ name: new RegExp(`^${req.validatedData.name}$`, 'i') });
    if (exists) return res.status(409).json({ status: 'error', message: 'Role already exists', permission: exists })

    const role = new Role({
        ...req.validatedData,
        created_by: req.user._id ?? null,
        updated_by: req.user._id ?? null,
    });
    await role.save();

    return res.status(201).json({ status: 'success', message: 'Role created', role });
};

const getAllRoles = async (req, res) => {
    const roles = await Role.find().populate([
        { path: "permissions", select: "name" },
        { path: "created_by", select: "name email" },
        { path: "updated_by", select: "name email" }
    ]);
    if (!roles.length) return res.status(404).json({ status: 'error', message: 'Roles not found', roles });

    return res.status(200).json({ status: 'success', message: "Roles retreived", roles });
};

const getRoleById = async (req, res) => {
    const role = await Role.findById(req.params.id).populate([
        { path: "permissions" },
        { path: "created_by", select: "name email" },
        { path: "updated_by", select: "name email" }
    ]);
    if (!role) return res.status(404).json({ status: 'error', message: 'Role not found' });

    return res.status(200).json({ status: 'success', role });
};

const updateRole = async (req, res) => {
    const { id } = req.params;

    if (req.validatedData?.name) {
        const exists = await Role.findOne({
            name: new RegExp(`^${req.validatedData.name}$`, "i"),
            _id: { $ne: id }
        });
        if (exists) {
            return res.status(409).json({
                status: 'error',
                message: 'Role already exists',
                role: exists
            });
        }
    }

    const role = await Role.findByIdAndUpdate(
        id,
        { ...req.validatedData, updated_by: req.user._id ?? null },
        { new: true }
    ).populate([
        { path: "permissions" },
        { path: "created_by", select: "name email" },
        { path: "updated_by", select: "name email" }
    ]);
    if (!role) return res.status(404).json({ status: 'error', message: 'Role not found' });

    return res.status(200).json({ status: 'success', message: 'Role updated', role });
};

const deleteRole = async (req, res) => {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) return res.status(404).json({ status: 'error', message: 'Role not found' });
    return res.status(200).json({ status: 'success', message: 'Role deleted' });
};

module.exports = {
    createRole,
    getAllRoles,
    getRoleById,
    updateRole,
    deleteRole,
};
