const mongoose = require('mongoose');

const LivroSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'O título é obrigatório'],
      trim: true,
    },
    autor: {
      type: String,
      required: [true, 'O autor é obrigatório'],
      trim: true,
    },
    anoPublicacao: {
      type: Number,
      required: [true, 'O ano de publicação é obrigatório'],
      min: [1000, 'Ano inválido'],
      max: [new Date().getFullYear(), 'Ano não pode ser no futuro'],
    },
    genero: {
      type: String,
      trim: true,
    },
    numeroPaginas: {
      type: Number,
      min: [1, 'Número de páginas deve ser positivo'],
    },
    isbn: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Livro', LivroSchema);
