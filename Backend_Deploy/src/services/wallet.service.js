const WalletMethod = require('../models/wallet.model');
const User = require('../models/user.model');

// Get all payment methods for a user
const getWalletMethodsService = async (userId) => {
    try {
        const methods = await WalletMethod.find({ user: userId }).sort({ createdAt: -1 });
        return { statusCode: 200, data: methods };
    } catch (error) {
        return { statusCode: 500, message: 'Error al obtener métodos de pago', details: error.message };
    }
};

// Add a new payment method
const addWalletMethodService = async (userId, data) => {
    try {
        const method = new WalletMethod({ user: userId, ...data });
        const saved = await method.save();
        return { statusCode: 201, data: saved, message: 'Método agregado con éxito' };
    } catch (error) {
        return { statusCode: 500, message: 'Error al agregar método', details: error.message };
    }
};

// Deposit: add funds to a method AND to user walletBalance
const depositToMethodService = async (userId, methodId, amount) => {
    try {
        const method = await WalletMethod.findOneAndUpdate(
            { _id: methodId, user: userId },
            { $inc: { balance: amount } },
            { new: true }
        );
        if (!method) return { statusCode: 404, message: 'Método no encontrado' };

        const user = await User.findByIdAndUpdate(
            userId,
            { $inc: { walletBalance: amount } },
            { new: true }
        );

        return {
            statusCode: 200,
            message: 'Depósito realizado con éxito',
            method,
            walletBalance: user.walletBalance
        };
    } catch (error) {
        return { statusCode: 500, message: 'Error al depositar', details: error.message };
    }
};

// Delete a payment method
const deleteWalletMethodService = async (userId, methodId) => {
    try {
        const method = await WalletMethod.findOneAndDelete({ _id: methodId, user: userId });
        if (!method) return { statusCode: 404, message: 'Método no encontrado' };
        return { statusCode: 200, message: 'Método eliminado' };
    } catch (error) {
        return { statusCode: 500, message: 'Error al eliminar', details: error.message };
    }
};

module.exports = {
    getWalletMethodsService,
    addWalletMethodService,
    depositToMethodService,
    deleteWalletMethodService,
};
