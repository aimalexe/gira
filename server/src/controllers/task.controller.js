const Task = require('../models/Task.model');
const Project = require('../models/Project.model');
const User = require('../models/User.model');
const fs = require("node:fs/promises");
const path = require("node:path");
const { safeDelete } = require('../utils/safe-delete-file.util');

const createTask = async (req, res) => {
    const { title, description, status, assigned_to, due_date, project } = req.validatedData;
    const created_by = req.user._id;

    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
        return res.status(404).json({ status: 'error', message: 'Project not found' });
    }
    const isMember = projectDoc.members.some(member => member.toString() === req.user._id.toString());
    if (req.user.role !== 'admin' && projectDoc.created_by.toString() !== req.user._id.toString() && !isMember) {
        return res.status(403).json({ status: 'error', message: 'Access denied: Not a project member or creator' });
    }

    const user = await User.findById(assigned_to);
    if (!user) {
        return res.status(400).json({ status: 'error', message: 'Assigned user not found' });
    }
    if (!projectDoc.members.includes(assigned_to)) {
        return res.status(400).json({ status: 'error', message: 'Assigned user is not a project member' });
    }

    const file_attachment = req.file
        ? {
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size,
            mimetype: req.file.mimetype,
        }
        : null;
    console.log("🚀 ~ createTask ~ file_attachment:", file_attachment)
    console.log("🚀 ~ createTask ~ req.file:", req.file)

    const task = new Task({
        title,
        description,
        status,
        assigned_to,
        created_by,
        updated_by: created_by,
        due_date,
        file_attachment,
        project,
    });

    await task.save();
    await task.populate([
        { path: 'assigned_to', select: 'name email' },
        { path: 'created_by', select: 'name email' },
        { path: 'updated_by', select: 'name email' },
        { path: 'project', select: 'name' }
    ]);

    res.status(201).json({ status: 'success', data: task });
};

const getAllTasks = async (req, res) => {
    const { id: projectId } = req.params;
    const { assignedTo, status, page = 1, limit = 10 } = req.validatedQuery;

    const project = await Project.findById(projectId);
    if (!project) {
        return res.status(404).json({ status: 'error', message: 'Project not found' });
    }

    const isMember = project.members.some(member => member.toString() === req.user._id.toString());
    if (req.user.role !== 'admin' && project.created_by.toString() !== req.user._id.toString() && !isMember) {
        return res.status(403).json({ status: 'error', message: 'Access denied: Not a project member or creator' });
    }

    const query = { project: projectId };
    if (assignedTo) {
        const user = await User.findById(assignedTo);
        if (!user) {
            return res.status(400).json({ status: 'error', message: 'Assigned user not found' });
        }
        query.assigned_to = assignedTo;
    }
    if (status) {
        if (!['To Do', 'In Progress', 'Done', 'Blocked'].includes(status)) {
            return res.status(400).json({ status: 'error', message: 'Invalid status' });
        }
        query.status = status;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [tasks, total] = await Promise.all([
        Task.find(query)
            .populate([
                { path: 'assigned_to', select: 'name email' },
                { path: 'created_by', select: 'name email' },
                { path: 'updated_by', select: 'name email' },
                { path: 'project', select: 'name' }
            ])
            .skip(skip)
            .limit(limitNum)
            .sort({ createdAt: -1 }),
        Task.countDocuments(query),
    ]);

    res.status(200).json({
        status: 'success',
        data: tasks,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            pages: Math.ceil(total / limitNum),
        },
    });
};

const getTaskById = async (req, res) => {
    const { projectId, id } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
        return res.status(404).json({ status: 'error', message: 'Project not found' });
    }

    const task = await Task.findById(id).populate([
        { path: 'assigned_to', select: 'name email' },
        { path: 'created_by', select: 'name email' },
        { path: 'updated_by', select: 'name email' },
        { path: 'project', select: 'name' }
    ]);

    if (!task) {
        return res.status(404).json({ status: 'error', message: 'Task not found' });
    }

    const isMember = project.members.some(member => member.toString() === req.user._id.toString());
    const isTaskCreator = task.created_by._id.toString() === req.user._id.toString();
    const isAssigned = task.assigned_to._id.toString() === req.user._id.toString();
    const isProjectCreator = project.created_by.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isProjectCreator && !isTaskCreator && !isAssigned && !isMember) {
        return res.status(403).json({ status: 'error', message: 'Access denied: Not authorized to view this task' });
    }

    res.status(200).json({ status: 'success', data: task });
};

const updateTask = async (req, res) => {
    const { projectId, id } = req.params;
    const { assigned_to } = req.validatedData;

    const project = await Project.findById(projectId);
    if (!project) {
        return res.status(404).json({ status: "error", message: "Project not found" });
    }

    const task = await Task.findById(id);
    if (!task) {
        return res.status(404).json({ status: "error", message: "Task not found" });
    }

    const isTaskCreator = task.created_by.toString() === req.user._id.toString();
    const isAssigned = task.assigned_to.toString() === req.user._id.toString();
    const isProjectCreator = project.created_by.toString() === req.user._id.toString();
    if (req.user.role !== "admin" && !isProjectCreator && !isTaskCreator && !isAssigned) {
        return res.status(403).json({ status: "error", message: "Access denied" });
    }

    if (assigned_to) {
        const user = await User.findById(assigned_to);
        if (!user) {
            return res.status(400).json({ status: "error", message: "Assigned user not found" });
        }
        if (!project.members.includes(assigned_to)) {
            return res.status(400).json({ status: "error", message: "Assigned user is not a project member" });
        }
    }

    let fileAttachment = task.file_attachment;

    if (req.file) {
        const isDifferentFile =
            !fileAttachment ||
            fileAttachment.size !== req.file.size ||
            fileAttachment.mimetype !== req.file.mimetype;

        if (isDifferentFile) {
            if(fileAttachment?.path) await safeDelete(fileAttachment?.path);

            fileAttachment = {
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size,
                mimetype: req.file.mimetype,
            };
        }
    }

    const updatedTask = await Task.findByIdAndUpdate(
        id,
        {
            ...req.validatedData,
            updated_by: req.user._id,
            file_attachment: fileAttachment,
        },
        { new: true, runValidators: true }
    );

    await updatedTask.populate([
        { path: "assigned_to", select: "name email" },
        { path: "created_by", select: "name email" },
        { path: "updated_by", select: "name email" },
        { path: "project", select: "name" },
    ]);

    res.status(200).json({ status: "success", data: updatedTask });
};


const deleteTask = async (req, res) => {
    const { projectId, id } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
        return res.status(404).json({ status: 'error', message: 'Project not found' });
    }

    const task = await Task.findById(id);
    if (!task) {
        return res.status(404).json({ status: 'error', message: 'Task not found' });
    }

    const isTaskCreator = task.created_by.toString() === req.user._id.toString();
    const isAssigned = task.assigned_to.toString() === req.user._id.toString();
    const isProjectCreator = project.created_by.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isProjectCreator && !isTaskCreator && !isAssigned) {
        return res.status(403).json({ status: 'error', message: 'Access denied: Not authorized to delete this task' });
    }

    if (task.file_attachment?.path) {
        safeDelete(task.file_attachment?.path)
    }
    await Task.findByIdAndDelete(id);
    res.status(204).json({ status: 'success', data: null });
};

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
};