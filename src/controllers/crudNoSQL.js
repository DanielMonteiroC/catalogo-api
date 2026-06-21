/**
 * Fábrica de controllers CRUD para modelos Mongoose.
 * Reduz duplicação de código entre livros, bicicletas e marcas de tênis.
 * @param {import('mongoose').Model} Model - Modelo Mongoose alvo.
 * @param {string} nomeRecurso - Nome legível do recurso (para mensagens).
 */
const criarCrudNoSQL = (Model, nomeRecurso) => {
  const criar = async (req, res, next) => {
    try {
      const doc = await Model.create(req.body);
      return res.status(201).json(doc);
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(422).json({ erro: err.message });
      }
      next(err);
    }
  };

  const listar = async (req, res, next) => {
    try {
      const docs = await Model.find().sort({ createdAt: -1 });
      return res.json(docs);
    } catch (err) {
      next(err);
    }
  };

  const buscarPorId = async (req, res, next) => {
    try {
      const doc = await Model.findById(req.params.id);
      if (!doc) return res.status(404).json({ erro: `${nomeRecurso} não encontrado(a).` });
      return res.json(doc);
    } catch (err) {
      next(err);
    }
  };

  const atualizar = async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!doc) return res.status(404).json({ erro: `${nomeRecurso} não encontrado(a).` });
      return res.json(doc);
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(422).json({ erro: err.message });
      }
      next(err);
    }
  };

  const remover = async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ erro: `${nomeRecurso} não encontrado(a).` });
      return res.json({ mensagem: `${nomeRecurso} removido(a) com sucesso.` });
    } catch (err) {
      next(err);
    }
  };

  return { criar, listar, buscarPorId, atualizar, remover };
};

module.exports = criarCrudNoSQL;
