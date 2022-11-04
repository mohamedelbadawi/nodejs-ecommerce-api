const router = require('express').Router();
const { auth } = require('../middlewares/TokenHandler');
const { getLoggedUserAddresses, addUserAddress, removeUserAddress } = require('../services/addressesServices');
const { addUserAddressValidator, removeUserAddressValidator } = require('../utils/validators/AddressValidator');



router.route('/').get(auth, getLoggedUserAddresses).post(auth, addUserAddressValidator, addUserAddress).delete(auth, removeUserAddressValidator, removeUserAddress);

module.exports = router;