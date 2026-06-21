const criarCrudNoSQL = require('./crudNoSQL');
const Livro = require('../models/Livro');
const Bicicleta = require('../models/Bicicleta');
const MarcaTenis = require('../models/MarcaTenis');

const livroController = criarCrudNoSQL(Livro, 'Livro');
const bicicletaController = criarCrudNoSQL(Bicicleta, 'Bicicleta');
const marcaTenisController = criarCrudNoSQL(MarcaTenis, 'Marca de Tênis');

module.exports = { livroController, bicicletaController, marcaTenisController };
