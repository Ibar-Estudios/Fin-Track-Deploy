const Movement = require('../models/movement.model');
const Asset = require('../models/asset.model');

const getShoppingHistoryByIdService = async (assetId) => {
    try {
        const movements = await Movement.find({ asset: assetId }).sort({ date: -1 });

        if (!movements.length) {
            return { statusCode: 404, message: 'No hay movimientos registrados para este activo' };
        }

        return { statusCode: 200, movements };
    } catch (error) {
        console.error('Error al obtener historial:', error.message);
        return { statusCode: 500, message: 'Error interno al consultar historial' };
    }
};

const registerShoppingService = async (asset, type, quantity, price, date) => {
    try {
        if (!['BUY', 'SELL'].includes(type)) {
            return { statusCode: 400, message: 'Tipo de movimiento inválido' };
        }

        const assetFound = await Asset.findById(asset);
        if (!assetFound) {
            return { statusCode: 404, message: 'Activo no encontrado' };
        }

        if (type === 'SELL' && assetFound.value < quantity) {
            return { statusCode: 400, message: 'Cantidad a vender excede lo disponible' };
        }

        const movement = new Movement({ asset, type, quantity, price, date });
        await movement.save();

        if (type === 'BUY') {
            const previousQuantity = assetFound.value;
            const previousAverage = assetFound.averagePrice || 0;

            const totalCost = previousAverage * previousQuantity;
            const newCost = price * quantity;
            const newTotalQuantity = previousQuantity + quantity;

            assetFound.averagePrice = (totalCost + newCost) / newTotalQuantity;
            assetFound.value = newTotalQuantity;
        } else if (type === 'SELL') {
            assetFound.value -= quantity;
        }

        await assetFound.save();

        return { statusCode: 201, message: 'Movimiento registrado', movement };
    } catch (error) {
        console.error('Error en registerShoppingService:', error.message);
        return { statusCode: 500, message: 'Ocurrió un error al registrar el movimiento' };
    }
};


module.exports = {
    getShoppingHistoryByIdService,
    registerShoppingService
};
