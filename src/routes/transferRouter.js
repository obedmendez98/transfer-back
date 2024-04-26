const express = require('express');
const router = express.Router();
const transfersController = require('../controllers/transfersController');

router.get('/transfers', transfersController.getAllTransfers);
router.get('/grouped-by-destination/', transfersController.getTransfersGroupedByDestinationAccount);
router.get('/top-3-by-amount/', transfersController.getTop3TransfersByAmount);
router.get('/grouped-by-origin/', transfersController.getTransfersGroupedByOriginAccount);
router.post('/add', transfersController.createTransfer);

module.exports = router;
