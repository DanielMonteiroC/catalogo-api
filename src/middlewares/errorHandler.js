/**
 * Middleware global de tratamento de erros.
 * Deve ser registrado por último no app.js.
 */
const errorHandler = (err, req, res, next) => {
  console.error('[Erro]', err.stack || err.message);

  const status = err.status || 500;
  const mensagem = err.message || 'Erro interno no servidor.';

  res.status(status).json({ erro: mensagem });
};

module.exports = errorHandler;
