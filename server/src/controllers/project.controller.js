const Project = require('../models/Project.model');
const Task = require('../models/Task.model');
const User = require('../models/User.model');

const createProject = async (req, res) => {
    const { name, description, members } = req.validatedData;
    const created_by = req?.user._id;

    if (members && members.length > 0) {
        const users = await User.find({ _id: { $in: members } }).select('_id');
        const foundUserIds = users.map(user => user._id.toString());
        const invalidIds = members.filter(id => !foundUserIds.includes(id));
        if (invalidIds.length > 0)
            return res.status(400).json({ success: false, message: "Invalid user IDs", data: invalidIds })
    }

    const project = new Project({
        name,
        description,
        created_by,
        members: members,
    });

    await project.save();
    res.status(201).json({ status: 'success', data: project });
};

const getAllProjects = async (req, res) => {
    const query = req.user.role.name === 'admin'
        ? { $or: [{ created_by: req.user._id }, { members: req.user._id }] }
        : { members: req.user._id };

    const projects = await Project.find(query).populate('created_by', 'name email').populate('members', 'name email');
    res.status(200).json({ status: 'success', data: projects });
};

const getProjectById = async (req, res) => {
    const project = await Project.findById(req.params.id)
        .populate('created_by', 'name email')
        .populate('members', 'name email');

    if (!project)
        return res.status(400).json({
            success: false,
            message: 'Project not found'
        })

    const isMember = project.members.some(member =>
        member._id.toString() === req.user._id.toString()
    );
    if (req.user.role !== 'admin' && !isMember) {
        return res.status(403).json({
            success: false,
            message: 'Access denied: You are not a member of this project'
        })
    }

    res.status(200).json({ status: 'success', data: project });
};

const updateProject = async (req, res) => {
    const project = await Project.findByIdAndUpdate(
        req.params.id,
        req.validatedData,
        { new: true, runValidators: true }
    );

    if (!project)
        return res.status(400).json({
            success: false,
            message: 'Project not found'
        })

    res.status(200).json({ status: 'success', data: project });
};

/* //* Transaction code not supported in standalone mongo
const deleteProject = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const project = await Project.findById(req.params.id).session(session);
        if (!project) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                message: 'Project not found'
            });
        }

        await Task.deleteMany({ project: req.params.id }).session(session);
        await Project.findByIdAndDelete(req.params.id).session(session);

        await session.commitTransaction();
        session.endSession();
        res.status(204).json({ status: 'success', message: "project deleted successfully", data: null });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ status: 'error', message: 'Failed to delete project and tasks' });
    }
}; */

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(400).json({
                success: false,
                message: 'Project not found'
            });
        }

        await Task.deleteMany({ project: req.params.id });
        await Project.findByIdAndDelete(req.params.id);

        res.status(204).json({ status: 'success', message: "project deleted successfully", data: null });
    } catch (error) {
        console.log("🚀 ~ deleteProject ~ error:", error)
        return res.status(500).json({ status: 'error', message: 'Failed to delete project and tasks' });
    }
};

const addMember = async (req, res) => {
    const { userIds } = req.validatedData;
    const project = await Project.findById(req.params.id).populate('created_by', 'name email');
    if (!project)
        return res.status(400).json({
            success: false,
            message: 'Project not found'
        })

    // Validate all user IDs
    const users = await User.find({ _id: { $in: userIds } }).select('_id');
    const foundUserIds = users.map(user => user._id.toString());
    const invalidIds = userIds.filter(id => !foundUserIds.includes(id));
    if (invalidIds.length > 0) {
        return res.status(400).json({ success: false, message: "Invalid user IDs", data: invalidIds })
    }

    const alreadyMembers = userIds.filter(id => project.members.includes(id));
    if (alreadyMembers.length > 0) {
        return res.status(400).json({ success: false, message: "Users already members", data: alreadyMembers })
    }

    project.members.push(...userIds);
    await project.save();

    res.status(200).json({ status: 'success', data: project });
};

const removeMember = async (req, res) => {
    const { userIds } = req.validatedData;
    const project = await Project.findById(req.params.id).populate('created_by', 'name email');
    if (!project)
        return res.status(400).json({
            success: false,
            message: 'Project not found'
        })

    const nonMembers = userIds.filter(id => !project.members.includes(id));
    if (nonMembers.length > 0) {
        return res.status(400).json({ success: false, message: "Users not members", data: nonMembers })
    }

    // Remove members
    project.members = project.members.filter(memberId => !userIds.includes(memberId.toString()));
    await project.save();

    res.status(200).json({ status: 'success', data: project });
};

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addMember,
    removeMember,
};