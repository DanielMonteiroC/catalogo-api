const mongoose = require('mongoose');

const BicicletaSchema = new mongoose.Schema(
  {
    marca: {
      type: String,
      required: [true, 'A marca é obrigatória'],
      trim: true,
    },
    modelo: {
      type: String,
      required: [true, 'O modelo é obrigatório'],
      trim: true,
    },
    tipo: {
      type: String,
      required: [true, 'O tipo é obrigatório'],
      enum: ['mountain', 'speed', 'urbana', 'infantil', 'gravel', 'bmx'],
    },
    tamanhoAro: {
      type: Number,
      required: [true, 'O tamanho do aro é obrigatório'],
    },
    numeroDeMarchas: {
      type: Number,
      default: 1,
    },
    cor: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bicicleta', BicicletaSchema);
