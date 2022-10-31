const router = require('express').Router();
const { signupValidator, loginValidator } = require('../utils/validators/AuthValidator');
const { signup, login } = require('../services/AuthServices');

router.route('/signup').post(signupValidator, signup);
router.route('/login').post(loginValidator, login);

module.exports = router;