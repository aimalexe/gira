const express = require('express');
const asyncHandler = require('../middlewares/async-handler');
const { authenticateUser, allowRoles } = require('../middlewares/auth.middleware');
const isValidId = require('../middlewares/is-valid-id');
const validateAndSanitize = require('../middlewares/validate-and-sanitize');
const { validateCreateTask, validateUpdateTask, validateTaskQuery } = require('../validators/task.validator');
const controller = require('../controllers/task.controller');
const upload = require('../middlewares/upload.middleware');

const router = express.Router({ mergeParams: true });

router.post(
    '/',
    [authenticateUser, upload.single("file_attachment"), validateAndSanitize(validateCreateTask)],
    asyncHandler(controller.createTask)
);

router.get(
    '/:id', //projectId
    [authenticateUser, isValidId, validateAndSanitize(validateTaskQuery, "query")],
    asyncHandler(controller.getAllTasks)
);

router.get(
    '/:projectId/:id',
    [authenticateUser, isValidId],
    asyncHandler(controller.getTaskById)
);

router.put(
    '/:projectId/:id',
    [authenticateUser, isValidId, upload.single("file_attachment"), validateAndSanitize(validateUpdateTask)],
    asyncHandler(controller.updateTask)
);

router.delete(
    '/:projectId/:id',
    [allowRoles("admin"), isValidId],
    asyncHandler(controller.deleteTask)
);

module.exports = router;