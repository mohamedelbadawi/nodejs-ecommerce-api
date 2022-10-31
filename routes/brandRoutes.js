const router = require('express').Router();
const { updateUser, getUser, deleteUser, getUsers, createUser, uploadUserImage, resizeUserImage } = require('../services/UserServices');
// const { createUserValidator, getUserValidator, updateUserValidator, deleteUserValidator } = require('../utils/validators/UserValidator');

router.route('/').post(uploadUserImage, resizeUserImage, createUser).get(getUsers);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;