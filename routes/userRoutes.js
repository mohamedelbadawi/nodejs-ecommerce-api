const router = require('express').Router();
const { allowedTo, auth } = require('../middlewares/TokenHandler');
const { updateUser, getUser, deleteUser, getUsers, createUser, uploadUserImage, resizeUserImage, updateUserPassword, getLoggedUser, deActiveUserData } = require('../services/UserServices');
const { createUserValidator, getUserValidator, updateUserValidator, deleteUserValidator, updateUserPasswordValidator } = require('../utils/validators/UserValidator');

router.get('/get-me', auth)
router.route('/').post(auth, allowedTo('admin'), uploadUserImage, resizeUserImage, createUserValidator, createUser).get(auth, getUsers);
router.route('/:id').get(getUserValidator, getUser).put(auth, allowedTo('admin'), updateUserValidator, updateUser).delete(auth, allowedTo('admin'), deleteUserValidator, deleteUser);
router.put('/changePassword/:id', updateUserPasswordValidator, updateUserPassword)
router.post('/deactive', auth, allowedTo('manager', 'admin'), deActiveUserData)
module.exports = router;