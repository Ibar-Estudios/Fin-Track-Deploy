const mongoose = require('mongoose');
const { Schema } = mongoose;

const AssetSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre del activo es obligatorio'],
        trim: true // Limpia espacios innecesarios
    },
    type: {
        type: String,
        enum: ['stock', 'bond', 'crypto', 'real_estate', 'commodity', 'other'],
        required: [true, 'El tipo de activo es obligatorio']
    },
    value: {
        type: Number,
        required: [true, 'El valor del activo es obligatorio'],
        min: [0, 'El valor no puede ser negativo']
    },
    currency: {
        type: String,
        default: 'USD',
        uppercase: true // Setter de Mongoose, para poner automático las letras mayúsculas al guardar el dato.(ars => ARS)
    },
    averagePrice: {
        type: Number,
        default: 0,
        min: [0, 'El precio promedio no puede ser negativo']
    },
    currentPrice: {
        type: Number,
        default: 0,
        min: [0, 'El precio actual no puede ser negativo']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Para enlaza cada asset a un usuario de forma directa.
        required: true
    }
}, {
    timestamps: true // crea createdAt y updatedAt automáticos
});

const Asset = mongoose.model("Asset", AssetSchema);

module.exports = Asset;