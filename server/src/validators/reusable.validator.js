const Joi = require('joi');

const objectId = Joi.string().hex().length(24).message('Invalid ObjectId');

module.exports = { objectId };