const express = require('express');
const asyncHandler = require('../middlewares/async-handler');
const { authorize } = require('../middlewares/auth.middleware');
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
    [authorize({ permissions: ["create:user", "update:role"] })],
    validateAndSanitize(validateCreateUser),
    asyncHandler(userController.createUser)
);

router.get(
    '/',
    [authorize({ permissions: ["view:user"] })],
    asyncHandler(userController.getAllUsers)
);

router.get(
    '/:id',
    [authorize({ permissions: ["view:user"] }), isValidId],
    asyncHandler(userController.getUserById)
);

router.put(
    '/:id',
    [
        authorize({ permissions: ["update:user"] }),
        isValidId,
        validateAndSanitize(validateUpdateUser)
    ],
    asyncHandler(userController.updateUser)
);

router.delete(
    '/:id',
    [authorize({ permissions: ["delete:user"] }), isValidId],
    asyncHandler(userController.deleteUser)
);

module.exports = router;