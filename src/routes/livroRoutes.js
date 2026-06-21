const { Router } = require('express');
const { livroController: c } = require('../controllers/catalogoControllers');
const { autenticar } = require('../middlewares/auth');

const router = Router();
router.use(autenticar);

/**
 * @openapi
 * tags:
 *   name: Livros
 *   description: CRUD de livros (MongoDB) — requer autenticação
 *
 * /api/livros:
 *   get:
 *     summary: Lista todos os livros
 *     tags: [Livros]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de livros
 *       401:
 *         description: Não autorizado
 *   post:
 *     summary: Cadastra um novo livro
 *     tags: [Livros]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titulo, autor, anoPublicacao]
 *             properties:
 *               titulo:
 *                 type: string
 *               autor:
 *                 type: string
 *               anoPublicacao:
 *                 type: integer
 *               genero:
 *                 type: string
 *               numeroPaginas:
 *                 type: integer
 *               isbn:
 *                 type: string
 *     responses:
 *       201:
 *         description: Livro criado
 *
 * /api/livros/{id}:
 *   get:
 *     summary: Busca livro por ID
 *     tags: [Livros]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Livro encontrado
 *       404:
 *         description: Não encontrado
 *   put:
 *     summary: Atualiza livro por ID
 *     tags: [Livros]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Atualizado
 *   delete:
 *     summary: Remove livro por ID
 *     tags: [Livros]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Removido
 */
router.get('/', c.listar);
router.post('/', c.criar);
router.get('/:id', c.buscarPorId);
router.put('/:id', c.atualizar);
router.delete('/:id', c.remover);

module.exports = router;
