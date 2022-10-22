const router = require('express').Router();
const { getCategories } = require('../services/CategoryServices');
router.get('/', getCategories);
module.exports = router;