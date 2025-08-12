const express = require('express');
const asyncHandler = require('../middlewares/async-handler');
const { authorize } = require('../middlewares/auth.middleware');
const isValidId = require('../middlewares/is-valid-id');
const validateAndSanitize = require('../middlewares/validate-and-sanitize');

const { validateCreateRole, validateUpdateRole } = require('../validators/role.validator');
const roleController = require('../controllers/role.controller');

const router = express.Router();

router.post(
    '/',
    [
        authorize({ roles: ["admin"] }),
        validateAndSanitize(validateCreateRole),
    ],
    asyncHandler(roleController.createRole)
);

router.get(
    '/',
    [authorize({ roles: ["admin"] })],
    asyncHandler(roleController.getAllRoles)
);

router.get(
    '/:id',
    [authorize({ roles: ["admin"] }), isValidId],
    asyncHandler(roleController.getRoleById)
);

router.put(
    '/:id',
    [authorize({ roles: ["admin"] }), isValidId, validateAndSanitize(validateUpdateRole)],
    asyncHandler(roleController.updateRole)
);

router.delete(
    '/:id',
    [authorize({ roles: ["admin"] }), isValidId],
    asyncHandler(roleController.deleteRole)
);

module.exports = router;
