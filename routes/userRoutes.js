const router = require('express').Router();
const { updateUser, getUser, deleteUser, getUsers, createUser, uploadUserImage, resizeUserImage, updateUserPassword } = require('../services/UserServices');
const { createUserValidator, getUserValidator, updateUserValidator, deleteUserValidator, updateUserPasswordValidator } = require('../utils/validators/UserValidator');

router.route('/').post(uploadUserImage, resizeUserImage, createUserValidator, createUser).get(getUsers);
router.route('/:id').get(getUserValidator, getUser).put(updateUserValidator, updateUser).delete(deleteUserValidator, deleteUser);
router.put('/changePassword/:id', updateUserPasswordValidator, updateUserPassword)

module.exports = router;