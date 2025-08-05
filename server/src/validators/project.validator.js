const Joi = require('joi');
const { objectId } = require('./reusable.validator');

const name = Joi.string().trim().min(2).max(100);
const description = Joi.string().trim().max(1500).allow('');
const members = Joi.array().items(objectId);

const validateCreateProject = (data) => {
    const schema = Joi.object({
        name: name.required(),
        description: description,
        members: members.optional().default([]),
    });

    return schema.validate(data);
};

const validateUpdateProject = (data) => {
    const schema = Joi.object({
        name: name.optional(),
        description: description.optional(),
    }).min(1);

    return schema.validate(data);
};

const validateAddRemoveMember = (data) => {
    const schema = Joi.object({
        userIds: members.min(1).required()
    });

    return schema.validate(data);
};

module.exports = {
    validateCreateProject,
    validateUpdateProject,
    validateAddRemoveMember,
};