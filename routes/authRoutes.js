const router = require('express').Router();
const { signupValidator, loginValidator } = require('../utils/validators/AuthValidator');
const { signup, login, resetPasswordViaEmail, verifyResetCode, updatePassword } = require('../services/AuthServices');

router.route('/signup').post(signupValidator, signup);
router.route('/login').post(loginValidator, login);
router.route('/reset-password-email').post(resetPasswordViaEmail);
router.route('/verify-code').post(verifyResetCode);
router.route('/update-password/:id').put(updatePassword);

module.exports = router;