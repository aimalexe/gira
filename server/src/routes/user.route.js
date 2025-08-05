const express = require('express');
const asyncHandler  = require('../middlewares/async-handler');
const { allowRoles, authenticateUser } = require('../middlewares/auth.middleware');
const isValidId = require('../middlewares/is-valid-id');
const validateAndSanitize = require('../middlewares/validate-and-sanitize');
const {
    validateCreateUser,
    validateUpdateUser
} = require('../validators/user.validator');
const userController = require("../controllers/user.controller")

const router = express.Router();

router.post(
    '/',
    // [allowRoles('admin')],
    validateAndSanitize(validateCreateUser),
    asyncHandler(userController.createUser)
);

router.get(
    '/',
    // [allowRoles('admin')],
    asyncHandler(userController.getAllUsers)
);

router.get(
    '/:id',
    [/* allowRoles('admin'), */ isValidId],
    asyncHandler(userController.getUserById)
);

router.put(
    '/:id',
    [/* allowRoles('admin'), */ isValidId, validateAndSanitize(validateUpdateUser)],
    asyncHandler(userController.updateUser)
);

router.delete(
    '/:id',
    [/* allowRoles('admin'), */ isValidId],
    asyncHandler(userController.deleteUser)
);

module.exports = router;