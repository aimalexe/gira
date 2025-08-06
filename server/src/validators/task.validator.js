const Joi = require('joi');
const { objectId } = require('./reusable.validator');
const STATUSES = require('../constants/status.const')

const title = Joi.string().trim().min(2).max(100);
const description = Joi.string().trim().max(500).allow('');
const status = Joi.string().valid(...STATUSES);
const due_date = Joi.date().iso().greater('now');
const file_attachment = Joi.string().uri().trim().max(200).allow('').optional();

const validateCreateTask = (data) => {
    const schema = Joi.object({
        title: title.required(),
        description: description,
        status: status.default('To Do'),
        assigned_to: objectId.required(),
        due_date: due_date.required(),
        file_attachment: file_attachment,
        project: objectId.required(),
    });

    return schema.validate(data);
};

const validateUpdateTask = (data) => {
    const schema = Joi.object({
        title: title.optional(),
        description: description.optional(),
        status: status.optional(),
        assigned_to: objectId.optional(),
        updated_by: objectId.optional(),
        due_date: due_date.optional(),
        file_attachment: file_attachment,
        project: objectId.optional(),
    }).min(1);

    return schema.validate(data);
};

const validateTaskQuery = data => {
    const schema = Joi.object({
        assignedTo: objectId.optional(),
        status: status.optional(),
        page: Joi.number().min(1).default(1),
        limit: Joi.number().min(5).max(200).default(10)
    });

    return schema.validate(data);
}

module.exports = {
    validateCreateTask,
    validateUpdateTask,
    validateTaskQuery
};