const Asset = require('../models/asset.model');
const axios = require('axios');
require('dotenv').config();

// GET - Assets por usuario
const getAssetUserByIdService = async (userId) => {
  try {
    const assets = await Asset.find({ user: userId });

    if (!assets.length) {
      return {
        statusCode: 200, // o 404 si querés marcarlo como "no encontrado"
        message: "No se encontraron activos",
        data: [],
      };
    }

    return {
      statusCode: 200,
      data: assets,
    };
  } catch (error) {
    console.error("Error en getAssetUserByIdService:", error.message);
    return {
      statusCode: 500,
      message: "Error interno al obtener activos",
    };
  }
};




const getCurrentPriceFromAPI = async (symbol) => {
  try {
    const apiKey = process.env.MARKETSTACK_KEY;
    const url = `http://api.marketstack.com/v1/eod/latest?access_key=${apiKey}&symbols=${symbol}`;

    const response = await axios.get(url);
    const data = response.data;

    if (!data || !data.data || !data.data.length) {
      throw new Error('No se encontró información de cotización');
    }
    const currentPrice = data.data[0].close;
    return currentPrice;
  } catch (error) {
    console.error('Error al obtener precio desde Marketstack:', error.message);
    return null; // Fallback si falla la API
  }
};

// POST - Crear asset
const createAssetService = async (userId, assetsData) => {
  const currentPrice = await getCurrentPriceFromAPI(assetsData.name);

  const newAsset = new Asset({
    ...assetsData,
    user: userId,
    currentPrice: currentPrice || 0 // fallback si falla la API
  });

  return await newAsset.save();
};


// PUT - Editar asset por ID
const editAssetByIdService = async (assetId, editData) => {
  try {
    if (editData.name) {
      if (!editData.symbol || typeof editData.symbol !== "string") {
        throw new Error(`Símbolo inválido: ${editData.symbol}`);
      }
      const currentPrice = await getCurrentPriceFromAPI(editData.symbol);
      if (currentPrice !== null) {
        editData.currentPrice = currentPrice;
      }
    }

    const updatedAsset = await Asset.findByIdAndUpdate(assetId, editData, { new: true });
    if (!updatedAsset) {
      return {
        statusCode: 404,
        message: "Activo no encontrado",
      };
    }

    return {
      statusCode: 200,
      message: "Activo editado con éxito",
      data: updatedAsset,
    };
  } catch (error) {
    console.error("Error al editar el activo:", error.message);
    return {
      statusCode: 500,
      message: "Error interno al editar el activo",
    };
  }
};


// DELETE - Eliminar asset por ID
const deleteAssetByIdService = async (assetId) => {
  const deletedAsset = await Asset.findByIdAndDelete(assetId);

  if (!deletedAsset) {
    return {
      statusCode: 404,
      message: "Activo no encontrado"
    };
  }

  return {
    statusCode: 200,
    message: "Activo eliminado exitosamente."
  };
};


module.exports = {
  getAssetUserByIdService,
  createAssetService,
  editAssetByIdService,
  deleteAssetByIdService,
};
