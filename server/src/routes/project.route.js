const express = require('express');
const asyncHandler = require('../middlewares/async-handler');
const { allowRoles, authenticateUser } = require('../middlewares/auth.middleware');
const isValidId = require('../middlewares/is-valid-id');
const validateAndSanitize = require('../middlewares/validate-and-sanitize');
const {
    validateCreateProject,
    validateUpdateProject,
    validateAddRemoveMember,
} = require('../validators/project.validator');
const projectController = require('../controllers/project.controller');

const router = express.Router();

router.post(
    '/',
    [allowRoles('admin'), validateAndSanitize(validateCreateProject)],
    asyncHandler(projectController.createProject)
);

router.get(
    '/',
    [authenticateUser],
    asyncHandler(projectController.getAllProjects)
);

router.get(
    '/:id',
    [authenticateUser, isValidId],
    asyncHandler(projectController.getProjectById)
);

router.put(
    '/:id',
    [allowRoles('admin'), isValidId, validateAndSanitize(validateUpdateProject)],
    asyncHandler(projectController.updateProject)
);

router.delete(
    '/:id',
    [allowRoles('admin'), isValidId],
    asyncHandler(projectController.deleteProject)
);

router.post(
    '/:id/members',
    [allowRoles('admin'), isValidId, validateAndSanitize(validateAddRemoveMember)],
    asyncHandler(projectController.addMember)
);

router.delete(
    '/:id/members',
    [allowRoles('admin'), isValidId, validateAndSanitize(validateAddRemoveMember)],
    asyncHandler(projectController.removeMember)
);

module.exports = router;