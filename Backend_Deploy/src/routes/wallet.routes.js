const express = require('express');
const walletRouter = express.Router();
const {
    getWalletMethodsController,
    addWalletMethodController,
    depositToMethodController,
    deleteWalletMethodController,
} = require('../controllers/wallet.controller');

// GET all methods for user
walletRouter.get('/user/:userId', getWalletMethodsController);

// POST add method
walletRouter.post('/user/:userId', addWalletMethodController);

// POST deposit to a method
walletRouter.post('/user/:userId/deposit/:methodId', depositToMethodController);

// DELETE a method
walletRouter.delete('/user/:userId/:methodId', deleteWalletMethodController);

module.exports = walletRouter;
