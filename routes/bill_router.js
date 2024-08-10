// bill.router.js
const express = require('express');
const router = express.Router();
const BillController = require('../controllers/bill_controller');
const authMiddleware = require('../middleware/auth_middleware');

router.get('', BillController.getAllBills);
router.get('/:id', BillController.getBill);
router.post('', authMiddleware, BillController.createBill);
router.put('/:id', BillController.updateBill);
router.delete('/:id', BillController.deleteBill);

module.exports = router;

