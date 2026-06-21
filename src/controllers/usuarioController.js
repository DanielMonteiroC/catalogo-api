const Usuario = require('../models/Usuario');

const camposPublicos = { exclude: ['senha'] };

const criar = async (req, res, next) => {
  try {
    const { nomeCompleto, email, senha, perfil } = req.body;
    const novo = await Usuario.create({ nomeCompleto, email, senha, perfil });
    const resultado = novo.toJSON();
    delete resultado.senha;
    return res.status(201).json(resultado);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ erro: 'E-mail já cadastrado.' });
    }
    next(err);
  }
};

const listar = async (req, res, next) => {
  try {
    const usuarios = await Usuario.findAll({ attributes: camposPublicos });
    return res.json(usuarios);
  } catch (err) {
    next(err);
  }
};

const buscarPorId = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: camposPublicos,
    });
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado.' });
    return res.json(usuario);
  } catch (err) {
    next(err);
  }
};

const atualizar = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado.' });

    const { nomeCompleto, email, senha, perfil } = req.body;
    await usuario.update({ nomeCompleto, email, senha, perfil });

    return res.json({ mensagem: 'Usuário atualizado com sucesso.' });
  } catch (err) {
    next(err);
  }
};

const remover = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado.' });

    await usuario.destroy();
    return res.json({ mensagem: 'Usuário removido com sucesso.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { criar, listar, buscarPorId, atualizar, remover };
