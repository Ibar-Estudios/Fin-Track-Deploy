const express = require('express');
const assetRouter = express.Router();
const { assetUserByIdController, createAssetController, editAssetByIdController, deleteAssetByIdController } = require('../controllers/asset.controller')
const { validateSymbol } = require('../utils/validateSymbol');
// Ver activos del usuario
assetRouter.get('/user/:userId', assetUserByIdController);

// Cargar nuevo activo
assetRouter.post('/user/:userId', validateSymbol, createAssetController);

// Editar activo
assetRouter.put('/:assetId', validateSymbol, editAssetByIdController);

// Eliminar activo
assetRouter.delete('/:assetId', deleteAssetByIdController);

module.exports= assetRouter;
