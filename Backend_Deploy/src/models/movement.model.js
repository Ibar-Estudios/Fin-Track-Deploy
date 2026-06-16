const { mongoose, Schema} = require('mongoose');

const movementSchema = Schema({
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: true
  },
  type: {
    type: String,
    enum: ['BUY', 'SELL'],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, 'La cantidad debe ser positiva']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'El precio debe ser positivo']
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Movement = mongoose.model('Movement', movementSchema);

module.exports = Movement;

