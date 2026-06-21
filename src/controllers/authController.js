const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const gerarToken = (usuario) => {
  return jwt.sign(
    { id: usuario.id, perfil: usuario.perfil },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
  );
};

/**
 * POST /api/auth/login
 * Autentica o usuário e retorna um token JWT.
 */
const login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
    }

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const senhaCorreta = await usuario.verificarSenha(senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const token = gerarToken(usuario);

    return res.json({
      mensagem: 'Login realizado com sucesso.',
      token,
      usuario: {
        id: usuario.id,
        nomeCompleto: usuario.nomeCompleto,
        email: usuario.email,
        perfil: usuario.perfil,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { login };
