const axios = require('axios');
require('dotenv').config();

let cachedSymbols = null;
let lastFetchTime = null;
const CACHE_DURATION = 1000 * 60 * 60 * 12; // 12 horas

const fetchSymbolsFromMarketstack = async () => {
  const response = await axios.get('http://api.marketstack.com/v1/tickers', {
    params: {
      access_key: process.env.MARKETSTACK_KEY,
      limit: 1000 // puedes ajustar según tu plan
    }
  });

  return response.data.data.map(item => item.symbol.toUpperCase());
};

const validateSymbol = async (req, res, next) => {
  try {
    const now = Date.now();

    if (!cachedSymbols || now - lastFetchTime > CACHE_DURATION) {
      cachedSymbols = await fetchSymbolsFromMarketstack();
      lastFetchTime = now;
    }

    const { symbol } = req.body;
    if (!symbol || !cachedSymbols.includes(symbol.toUpperCase())) {
      return res.status(400).json({
        error: `El símbolo "${symbol}" no está soportado por Marketstack.`
      });
    }

    next();
  } catch (error) {
    console.error('Error al validar símbolo:', error.message);
    res.status(500).json({ error: 'Error interno al validar símbolo.' });
  }
};

module.exports = { validateSymbol };
