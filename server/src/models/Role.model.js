const { Schema, model, Types } = require('mongoose');

const roleSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Role name is required'],
        trim: true,
        unique: true,
        maxlength: [50, 'Role name too long']
    },
    description: {
        type: String,
        default: '',
        trim: true,
        maxlength: [255, 'Description too long']
    },
    permissions: {
        type: [{
            type: Types.ObjectId,
            ref: 'Permission'
        }],
        default: []
    },
    created_by: {
        type: Types.ObjectId,
        ref: 'User',
        required: [true, 'Created by is required'],
    },
    updated_by: {
        type: Types.ObjectId,
        ref: 'User',
        default: null,
    },
}, {
    timestamps: true
});

module.exports = model('Role', roleSchema);
