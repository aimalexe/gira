const authController = require('../controllers/auth.controller');
const asyncHandler = require('../middlewares/async-handler');
const validateAndSanitize = require('../middlewares/validate-and-sanitize');
const { validateLogin } = require('../validators/auth.validator');
const { authenticateUser } = require("../middlewares/auth.middleware");

const router = require('express').Router();

router.post(
    '/login',
    validateAndSanitize(validateLogin),
    asyncHandler(authController.login)
);

router.delete(
    '/logout',
    [authenticateUser],
    asyncHandler(authController.logout)
);

module.exports = router