const {
    getWalletMethodsService,
    addWalletMethodService,
    depositToMethodService,
    deleteWalletMethodService,
} = require('../services/wallet.service');

const getWalletMethodsController = async (req, res) => {
    const { userId } = req.params;
    const result = await getWalletMethodsService(userId);
    res.status(result.statusCode).json(result);
};

const addWalletMethodController = async (req, res) => {
    const { userId } = req.params;
    const result = await addWalletMethodService(userId, req.body);
    res.status(result.statusCode).json(result);
};

const depositToMethodController = async (req, res) => {
    const { userId, methodId } = req.params;
    const { amount } = req.body;
    if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'El monto debe ser mayor a cero' });
    }
    const result = await depositToMethodService(userId, methodId, Number(amount));
    res.status(result.statusCode).json(result);
};

const deleteWalletMethodController = async (req, res) => {
    const { userId, methodId } = req.params;
    const result = await deleteWalletMethodService(userId, methodId);
    res.status(result.statusCode).json(result);
};

module.exports = {
    getWalletMethodsController,
    addWalletMethodController,
    depositToMethodController,
    deleteWalletMethodController,
};
