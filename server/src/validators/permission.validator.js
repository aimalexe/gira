const Joi = require('joi');

const name = Joi.string().trim().min(2).max(100);
const description = Joi.string().trim().max(255);

const validateCreatePermission = (data) => {
    const schema = Joi.object({
        name: name.required(),
        description: description.optional(),
    });
    return schema.validate(data);
};

const validateUpdatePermission = (data) => {
    const schema = Joi.object({
        name: name.optional(),
        description: description.optional(),
    }).min(1);
    return schema.validate(data);
};

module.exports = {
    validateCreatePermission,
    validateUpdatePermission,
};
