const { getShoppingHistoryByIdService, registerShoppingService } = require('../services/movement.service')

// OBTENER HISTORIAL DE MOVIMIENTOS/COMPRAS
const getShoppingHistoryByIdController = async (request, response) => {
    const { id } = request.params; 
    const movements = await getShoppingHistoryByIdService(id);
    response.status(movements.statusCode).json(movements);
}

// REGISTRO DE COMPRA
const registerShoppingController = async (request, response) => {
    const { asset, type, quantity, price, date } = request.body;
    const movement = await registerShoppingService(asset, type, quantity, price, date);
    response.status(movement.statusCode).json(movement);
}

module.exports = {
    getShoppingHistoryByIdController,
    registerShoppingController,
}