const express = require('express');
const asyncHandler = require('../middlewares/async-handler');
const { authorize, authenticateUser } = require('../middlewares/auth.middleware');
const isValidId = require('../middlewares/is-valid-id');
const validateAndSanitize = require('../middlewares/validate-and-sanitize');

const { validateCreatePermission, validateUpdatePermission } = require('../validators/permission.validator');
const permissionController = require('../controllers/permission.controller');

const router = express.Router();

router.post(
    '/',
    [
        authorize({ roles: ["admin"] }),
        authenticateUser,
        validateAndSanitize(validateCreatePermission),
    ],
    asyncHandler(permissionController.createPermission)
);

router.get(
    '/',
    [authorize({ roles: ["admin"] })],
    asyncHandler(permissionController.getAllPermissions)
);

router.get(
    '/:id',
    [authorize({ roles: ["admin"] }), isValidId],
    asyncHandler(permissionController.getPermissionById)
);

router.put(
    '/:id',
    [authorize({ roles: ["admin"] }), isValidId, validateAndSanitize(validateUpdatePermission)],
    asyncHandler(permissionController.updatePermission)
);

router.delete(
    '/:id',
    [authorize({ roles: ["admin"] }), isValidId],
    asyncHandler(permissionController.deletePermission)
);

module.exports = router;
