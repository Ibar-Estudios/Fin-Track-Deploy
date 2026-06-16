const mongoose = require('mongoose');
const { Schema } = mongoose;

const WalletMethodSchema = Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['bank', 'mercadopago', 'paypal', 'crypto', 'cash'],
        required: true
    },
    label: { type: String, required: true, trim: true },
    lastFour: { type: String, default: '' },
    balance: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

const WalletMethod = mongoose.model('WalletMethod', WalletMethodSchema);
module.exports = WalletMethod;
