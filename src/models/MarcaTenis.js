const mongoose = require('mongoose');

const MarcaTenisSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'O nome da marca é obrigatório'],
      trim: true,
      unique: true,
    },
    paisSede: {
      type: String,
      required: [true, 'O país de sede é obrigatório'],
      trim: true,
    },
    anoFundacao: {
      type: Number,
      min: [1800, 'Ano de fundação inválido'],
    },
    segmentoFoco: {
      type: String,
      enum: ['corrida', 'basquete', 'futebol', 'casual', 'skate', 'crossfit', 'geral'],
      default: 'geral',
    },
    website: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MarcaTenis', MarcaTenisSchema);
