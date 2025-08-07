const Joi = require('joi');
const { email, password } = require('./reusable.validator');
const ROLES = require("../constants/roles.const");

const name = Joi.string().trim().min(2).max(50);
const role = Joi.string().valid(...ROLES);

const validateCreateUser = (data) => {
    const schema = Joi.object({
        name: name.required(),
        email: email.required(),
        password: password.default("password123"),
        role: role.required(),
    });

    return schema.validate(data);
};

const validateUpdateUser = (data) => {
    const schema = Joi.object({
        name: name.optional(),
        email: email.optional(),
        password: password.optional(),
    }).min(1);

    return schema.validate(data);
};

module.exports = {
    validateCreateUser,
    validateUpdateUser,
};