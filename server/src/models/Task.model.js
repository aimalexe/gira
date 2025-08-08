const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const fileAttachmentSchema = new Schema({
    filename: { type: String, trim: true, default: '' },
    path: { type: String, trim: true, default: '' },
    size: { type: Number, default: 0 },
    mimetype: { type: String, trim: true, default: '' },
},
    { _id: false }
);

const taskSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true,
        minlength: [2, 'Task title must be at least 2 characters'],
        maxlength: [100, 'Task title cannot exceed 100 characters'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters'],
        default: '',
    },
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Done', 'Blocked'],
        default: 'To Do',
    },
    assigned_to: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Assigned user is required'],
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Created by is required'],
    },
    updated_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    due_date: {
        type: Date,
        required: [true, 'Due date is required'],
    },
    file_attachment: {
        type: fileAttachmentSchema,
        default: null
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'Project is required'],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Task', taskSchema);