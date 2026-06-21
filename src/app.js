require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./config/swagger');
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const livroRoutes = require('./routes/livroRoutes');
const bicicletaRoutes = require('./routes/bicicletaRoutes');
const marcaTenisRoutes = require('./routes/marcaTenisRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// ── Segurança (OWASP Top 10) ────────────────────────────────────────────────
app.use(helmet());                    // Cabeçalhos HTTP seguros
app.use(cors());                      // Cross-Origin Resource Sharing
app.use(express.json({ limit: '50kb' })); // Limita payload (evita DoS)

// Rate Limiting — proteção contra força bruta e abuso de API
const limitador = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Muitas requisições deste endereço. Tente novamente em 15 minutos.' },
});
app.use('/api/', limitador);

// ── Documentação Swagger ─────────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Rotas ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/livros', livroRoutes);
app.use('/api/bicicletas', bicicletaRoutes);
app.use('/api/marcas-tenis', marcaTenisRoutes);

// Rota raiz de verificação de saúde
app.get('/', (req, res) => {
  res.json({ status: 'ok', docs: '/api-docs' });
});

// ── Tratamento global de erros ───────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
