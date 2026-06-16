const { getAssetUserByIdService, createAssetService, editAssetByIdService, deleteAssetByIdService } = require('../services/asset.service')

// GET - Todos los assets de un usuario
const assetUserByIdController = async (request, response) => {
    try {
        const { userId } = request.params; 
        const assets = await getAssetUserByIdService(userId);
        response.status(assets.statusCode || 200).json({ assets: assets.data });
    } catch (error) {
        response.status(500).json({ message: "Activos no encontrados" });
    }
}

// POST - Crear un asset
const createAssetController = async (request, response) => {
    try {
        const { userId } = request.params;
        const assetsData = request.body;
        const newAssets = await createAssetService(userId, assetsData);
        response.status(newAssets.statusCode || 201).json(newAssets);
    } catch (error) {
        response.status(500).json({ message: "Ocurrió un error" })
    }
}

// PUT - Editar un asset
const editAssetByIdController = async (request, response) => {
    try {
        const { assetId } = request.params;
        const editData = request.body;

        const result = await editAssetByIdService(assetId, editData);
        response.status(result.statusCode).json(result);
    } catch (error) {
        console.error("Error en el controlador de edición:", error.message);
        response.status(500).json({ message: "Error inesperado al editar el activo" });
    }
};

// DELETE - Eliminar un asset
const deleteAssetByIdController = async (request, response) => {
    try {
        const { assetId } = request.params;
        const assetDelete = await deleteAssetByIdService(assetId);
        response.status(assetDelete.statusCode).json(assetDelete)
    } catch (error) {
        response.status(500).json({ message: "Ocurrió un error" })
    }
}


module.exports = {
    assetUserByIdController,
    createAssetController,
    editAssetByIdController,
    deleteAssetByIdController,
}