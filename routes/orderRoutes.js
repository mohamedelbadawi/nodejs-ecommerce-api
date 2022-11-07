const router = require('express').Router();
const { auth, allowedTo } = require('../middlewares/TokenHandler');
const { createCashOrder, getAllOrders, filterOrderForLoggedUser, getOrder, checkOrderUser, updatePaymentStatus, updateDelivery, checkoutSession } = require('../services/OrderServices');
const { updatePaymentValidator, updateDeliveryValidator } = require('../utils/validators/OrderValidator');

router.route('/cash').post(auth, createCashOrder);
router.route('/card').post(auth, checkoutSession);
router.route('/').get(auth, filterOrderForLoggedUser, getAllOrders);
router.route('/:id').get(auth, filterOrderForLoggedUser, checkOrderUser, getOrder);
router.put('/:id/payment', auth, allowedTo('supervisor', 'admin'), updatePaymentValidator, updatePaymentStatus)
router.put('/:id/delivery', auth, allowedTo('supervisor', 'admin'), updateDeliveryValidator, updateDelivery)
module.exports = router;