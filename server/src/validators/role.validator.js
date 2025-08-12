const Joi = require('joi');
const { objectId } = require("./reusable.validator");

const name = Joi.string().trim().min(2).max(50);
const description = Joi.string().trim().max(255);

const validateCreateRole = (data) => {
    const schema = Joi.object({
        name: name.required(),
        description: description.optional(),
        permissions: Joi.array().items(objectId).min(1).required(),
    });
    return schema.validate(data);
};

const validateUpdateRole = (data) => {
    const schema = Joi.object({
        name: name.optional(),
        description: description.optional(),
        permissions: Joi.array().items(objectId).min(1).optional(),
    }).min(1);
    return schema.validate(data);
};

module.exports = {
    validateCreateRole,
    validateUpdateRole,
};
