const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

router.get('/accounts/:userId', accountController.getAllAccounts);

module.exports = router;
