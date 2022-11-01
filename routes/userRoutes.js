const router = require('express').Router();
const { allowedTo, auth } = require('../middlewares/TokenHandler');
const { updateUser, getUser, deleteUser, getUsers, createUser, uploadUserImage, resizeUserImage, updateUserPassword } = require('../services/UserServices');
const { createUserValidator, getUserValidator, updateUserValidator, deleteUserValidator, updateUserPasswordValidator } = require('../utils/validators/UserValidator');

router.route('/').post(auth, allowedTo('admin'), uploadUserImage, resizeUserImage, createUserValidator, createUser).get(getUsers);
router.route('/:id').get(getUserValidator, getUser).put(auth, allowedTo('admin'), updateUserValidator, updateUser).delete(auth, allowedTo('admin'), deleteUserValidator, deleteUser);
router.put('/changePassword/:id', updateUserPasswordValidator, updateUserPassword)

module.exports = router;