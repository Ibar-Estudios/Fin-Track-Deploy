const express = require('express');
const movementRouter = express.Router();
const { getShoppingHistoryByIdController, registerShoppingController } = require('../controllers/movement.controller')

// Historial del activo
movementRouter.get('/:id', getShoppingHistoryByIdController);

// Registrar compra/venta
movementRouter.post('/', registerShoppingController);

module.exports = movementRouter;

