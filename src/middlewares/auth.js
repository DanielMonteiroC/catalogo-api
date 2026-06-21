const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticação via JWT.
 * Verifica o token no header Authorization (formato: Bearer <token>).
 */
const autenticar = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ erro: 'Acesso negado. Token não informado.' });
  }

  const partes = authHeader.split(' ');

  if (partes.length !== 2 || partes[0].toLowerCase() !== 'bearer') {
    return res.status(401).json({ erro: 'Formato de token inválido. Use: Bearer <token>' });
  }

  const token = partes[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = payload.id;
    req.usuarioPerfil = payload.perfil;
    next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
};

/**
 * Middleware de autorização por perfil.
 * @param {...string} perfisPermitidos - Perfis que têm acesso à rota.
 */
const autorizar = (...perfisPermitidos) => {
  return (req, res, next) => {
    if (!perfisPermitidos.includes(req.usuarioPerfil)) {
      return res.status(403).json({ erro: 'Acesso proibido. Permissão insuficiente.' });
    }
    next();
  };
};

module.exports = { autenticar, autorizar };
