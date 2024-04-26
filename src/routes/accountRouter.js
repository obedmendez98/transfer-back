const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

router.get('/accounts/', accountController.getAllAccounts);
router.get('/balance/', accountController.getAccountBalances);

module.exports = router;
