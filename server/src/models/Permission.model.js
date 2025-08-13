const { Schema, model } = require('mongoose');

const permissionSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Permission name is required'],
        trim: true,
        unique: true,
        maxlength: [100, 'Permission name too long']
    },
    description: {
        type: String,
        default: '',
        trim: true,
        maxlength: [255, 'Description too long']
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
}, {
    timestamps: true
});

module.exports = model('Permission', permissionSchema);
