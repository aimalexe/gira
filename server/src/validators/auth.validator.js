const Joi = require('joi');
const {email, password} = require("./reusable.validator");

const validateLogin = (data) => {
    const schema = Joi.object({
        email: email.required(),
        password: password.required(),
    });

    return schema.validate(data);
};

module.exports = { validateLogin };