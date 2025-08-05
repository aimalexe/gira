const Joi = require('joi');

const objectId = Joi.string().hex().length(24).message('Invalid ObjectId');
const email = Joi.string().email().trim().lowercase().min(5).max(100);
const password = Joi.string().trim().min(6);

module.exports = { objectId, email, password };