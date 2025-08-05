const Joi = require('joi');
const { objectId } = require('./reusable.validator');

// Reusable validators
const name = Joi.string().trim().min(2).max(50);
const email = Joi.string().email().trim().lowercase().min(5).max(100);
const password = Joi.string().trim().min(6);
const role = Joi.string().valid('admin', 'user');
const createdBy = objectId.optional();
const updatedBy = objectId.optional();

// Create Validator
const validateCreateUser = (data) => {
    const schema = Joi.object({
        name: name.required(),
        email: email.required(),
        password: password.default("password123"),
        role: role.required(),
    });

    return schema.validate(data);
};

// Update Validator
const validateUpdateUser = (data) => {
    const schema = Joi.object({
        name: name.optional(),
        email: email.optional(),
        password: password.optional(),
        role: role.optional(),
    }).min(1);

    return schema.validate(data);
};

module.exports = {
    validateCreateUser,
    validateUpdateUser,
};