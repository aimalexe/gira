const express = require('express');
const asyncHandler = require('../middlewares/async-handler');
const { authorize } = require('../middlewares/auth.middleware');
const isValidId = require('../middlewares/is-valid-id');
const validateAndSanitize = require('../middlewares/validate-and-sanitize');
const { validateCreateTask, validateUpdateTask, validateTaskQuery } = require('../validators/task.validator');
const controller = require('../controllers/task.controller');
const upload = require('../middlewares/upload.middleware');

const router = express.Router({ mergeParams: true });

router.post(
    '/',
    [authorize({ permissions: ["create:task"] }), upload.single("file_attachment"), validateAndSanitize(validateCreateTask)],
    asyncHandler(controller.createTask)
);

router.get(
    '/:id', //projectId
    [authorize({ permissions: ["view:task"] }), isValidId, validateAndSanitize(validateTaskQuery, "query")],
    asyncHandler(controller.getAllTasks)
);

router.get(
    '/:projectId/:id',
    [authorize({ permissions: ["view:task"] }), isValidId],
    asyncHandler(controller.getTaskById)
);

router.put(
    '/:projectId/:id',
    [authorize({ permissions: ["update:task"] }), isValidId, upload.single("file_attachment"), validateAndSanitize(validateUpdateTask)],
    asyncHandler(controller.updateTask)
);

router.delete(
    '/:projectId/:id',
    [authorize("delete:task"), isValidId],
    asyncHandler(controller.deleteTask)
);

module.exports = router;