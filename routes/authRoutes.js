const router = require('express').Router();
const { signupValidator, loginValidator } = require('../utils/validators/AuthValidator');
const { signup, login, resetPasswordViaEmail, verifyResetCode, updatePassword, resetPasswordViaPhone } = require('../services/AuthServices');
const { auth } = require('../middlewares/TokenHandler');
const { getLoggedUser, getUser, updateUserPassword, updateUser } = require('../services/UserServices');

router.route('/signup').post(signupValidator, signup);
router.route('/login').post(loginValidator, login);
router.route('/reset-password-email').post(resetPasswordViaEmail);
router.route('/reset-password-phone').post(resetPasswordViaPhone);
router.route('/verify-code').post(verifyResetCode);
router.route('/update-password/:id').put(updatePassword);
router.get('/getMe', auth, getLoggedUser, getUser)
router.put('/updatePassword', auth, getLoggedUser, updateUserPassword)
router.put('/updateData', auth, getLoggedUser, updateUser)
module.exports = router;