const Permission = require('../models/Permission.model');

const createPermission = async (req, res) => {
    const exists = await Permission.findOne({ name: new RegExp(`^${req.validatedData.name}$`, "i") });
    if (exists) return res.status(409).json({ status: 'error', message: 'Permission already exists', permission: exists });

    const permission = new Permission({
        ...req.validatedData,
        created_by: req.user._id ?? null,
        updated_by: req.user._id ?? null,
    });
    await permission.save();
    return res.status(201).json({ status: 'success', message: 'Permission created', permission });
};

const getAllPermissions = async (req, res) => {
    const permissions = await Permission.find().populate([
        { path: "created_by", select: "name email" },
        { path: "updated_by", select: "name email" }
    ]);
    if (!permissions.length) return res.status(200).json({ status: 'success', message: "Permissions not found", permissions });
    return res.status(200).json({ status: 'success', message: "permissions retrived", permissions });
};

const getPermissionById = async (req, res) => {
    const permission = await Permission.findById(req.params.id).populate([
        { path: "created_by", select: "name email" },
        { path: "updated_by", select: "name email" }
    ]);
    if (!permission) return res.status(404).json({ status: 'error', message: 'Permission not found' });
    return res.status(200).json({ status: 'success', permission });
};

const updatePermission = async (req, res) => {
    const { id } = req.params;

    if (req.validatedData?.name) {
        const exists = await Permission.findOne({
            name: new RegExp(`^${req.validatedData.name}$`, "i"),
            _id: { $ne: id }
        });
        if (exists) {
            return res.status(409).json({
                status: 'error',
                message: 'Permission already exists',
                permission: exists
            });
        }
    }

    const permission = await Permission.findByIdAndUpdate(
        id,
        { ...req.validatedData, updated_by: req.user._id ?? null },
        { new: true }
    ).populate([
        { path: "created_by", select: "name email" },
        { path: "updated_by", select: "name email" }
    ]);
    if (!permission) return res.status(404).json({ status: 'error', message: 'Permission not found' });
    return res.status(200).json({ status: 'success', message: 'Permission updated', permission });
};

const deletePermission = async (req, res) => {
    const permission = await Permission.findByIdAndDelete(req.params.id);
    if (!permission) return res.status(404).json({ status: 'error', message: 'Permission not found' });
    return res.status(200).json({ status: 'success', message: 'Permission deleted' });
};

module.exports = {
    createPermission,
    getAllPermissions,
    getPermissionById,
    updatePermission,
    deletePermission,
};
