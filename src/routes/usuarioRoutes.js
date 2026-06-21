const { Router } = require('express');
const c = require('../controllers/usuarioController');
const { autenticar } = require('../middlewares/auth');

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Usuários
 *   description: Gerenciamento de usuários (PostgreSQL)
 *
 * /api/usuarios:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nomeCompleto, email, senha]
 *             properties:
 *               nomeCompleto:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               perfil:
 *                 type: string
 *                 enum: [admin, comum]
 *     responses:
 *       201:
 *         description: Usuário criado
 *       409:
 *         description: E-mail já cadastrado
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Usuários]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       401:
 *         description: Não autorizado
 *
 * /api/usuarios/{id}:
 *   get:
 *     summary: Busca usuário por ID
 *     tags: [Usuários]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       404:
 *         description: Não encontrado
 *   put:
 *     summary: Atualiza usuário por ID
 *     tags: [Usuários]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomeCompleto:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Atualizado
 *       404:
 *         description: Não encontrado
 *   delete:
 *     summary: Remove usuário por ID
 *     tags: [Usuários]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Removido
 *       404:
 *         description: Não encontrado
 */
router.post('/', c.criar);
router.get('/', autenticar, c.listar);
router.get('/:id', autenticar, c.buscarPorId);
router.put('/:id', autenticar, c.atualizar);
router.delete('/:id', autenticar, c.remover);

module.exports = router;
