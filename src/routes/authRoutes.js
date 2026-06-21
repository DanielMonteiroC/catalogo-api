const { Router } = require('express');
const { login } = require('../controllers/authController');

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Autenticação
 *   description: Endpoint de login
 *
 * /api/auth/login:
 *   post:
 *     summary: Realiza login e retorna token JWT
 *     tags: [Autenticação]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, senha]
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               senha:
 *                 type: string
 *                 example: minhasenha123
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', login);

module.exports = router;
