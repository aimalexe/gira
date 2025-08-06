const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const projectSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Project name is required'],
        trim: true,
        minlength: [2, 'Project name must be at least 2 characters'],
        maxlength: [100, 'Project name cannot exceed 100 characters'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1500, 'Description cannot exceed 1500 characters'],
        default: '',
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Created by is required'],
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: [],
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);