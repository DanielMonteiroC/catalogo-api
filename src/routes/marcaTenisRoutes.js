const { Router } = require('express');
const { marcaTenisController: c } = require('../controllers/catalogoControllers');
const { autenticar } = require('../middlewares/auth');

const router = Router();
router.use(autenticar);

/**
 * @openapi
 * tags:
 *   name: Marcas de Tênis
 *   description: CRUD de marcas de tênis (MongoDB) — requer autenticação
 *
 * /api/marcas-tenis:
 *   get:
 *     summary: Lista todas as marcas de tênis
 *     tags: [Marcas de Tênis]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de marcas
 *   post:
 *     summary: Cadastra uma nova marca de tênis
 *     tags: [Marcas de Tênis]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, paisSede]
 *             properties:
 *               nome:
 *                 type: string
 *               paisSede:
 *                 type: string
 *               anoFundacao:
 *                 type: integer
 *               segmentoFoco:
 *                 type: string
 *                 enum: [corrida, basquete, futebol, casual, skate, crossfit, geral]
 *               website:
 *                 type: string
 *     responses:
 *       201:
 *         description: Marca criada
 *
 * /api/marcas-tenis/{id}:
 *   get:
 *     summary: Busca marca por ID
 *     tags: [Marcas de Tênis]
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
 *         description: Encontrado
 *       404:
 *         description: Não encontrado
 *   put:
 *     summary: Atualiza marca por ID
 *     tags: [Marcas de Tênis]
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
 *     summary: Remove marca por ID
 *     tags: [Marcas de Tênis]
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
