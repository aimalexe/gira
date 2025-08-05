/**
 * A middleware function to validate and sanitize user inputs using Joi.
 * 
 * @param {Function} validationFunction - Joi validation function
 * @param {string} source - 'body' or 'query'
 */
const validateAndSanitize = (validationFunction, source = 'body') => (req, res, next) => {
    const dataToValidate = source === 'query' ? req.query : req.body;

    const { error, value } = validationFunction(dataToValidate);

    if (error) {
        return res.status(400).json({
            status: 'Validation Error',
            message: error.details?.[0]?.message || 'Invalid request data',
            details: error.details
        });
    }

    if (source === 'query') {
        req.validatedQuery = value;
    } else {
        req.validatedData = value;
    }

    next();
};

module.exports = validateAndSanitize;