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
        authorize({ permissions: ["create:role", "create:permission"] }),
        authenticateUser,
        validateAndSanitize(validateCreatePermission),
    ],
    asyncHandler(permissionController.createPermission)
);

router.get(
    '/',
    [authorize({ permissions: ["view:role", "view:permission"] })],
    asyncHandler(permissionController.getAllPermissions)
);

router.get(
    '/:id',
    [authorize({ permissions: ["view:role", "view:permission"] }), isValidId],
    asyncHandler(permissionController.getPermissionById)
);

router.put(
    '/:id',
    [authorize({ permissions: ["update:role", "update:permission"] }), isValidId, validateAndSanitize(validateUpdatePermission)],
    asyncHandler(permissionController.updatePermission)
);

router.delete(
    '/:id',
    [authorize({ permissions: ["delete:role", "delete:permission"] }), isValidId],
    asyncHandler(permissionController.deletePermission)
);

module.exports = router;
