// item.router.js
const express = require('express');
const router = express.Router();
const ItemController = require('../controllers/item_controller');
const authMiddleware = require('../middleware/auth_middleware');





router.get('', ItemController.getAllItems);
router.get('/:id', ItemController.getItem);
router.post('', authMiddleware, ItemController.addItem);
router.put('/:id', authMiddleware, ItemController.updateItem);
router.delete('/:id', authMiddleware, ItemController.deleteItem);

module.exports = router;
