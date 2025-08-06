const mongoose = require('mongoose');

const isValidId = (req, res, next) => {
    const { id } = req.params;
    const idToValidate = id;

    if (!mongoose.Types.ObjectId.isValid(idToValidate)) {
        return res.status(400).json({
            status: 'error',
            message: `The ID: ${idToValidate} is incorrect.`,
            details: 'Invalid MongoDB ObjectId'
        });
    }
    next();
};

module.exports = isValidId;