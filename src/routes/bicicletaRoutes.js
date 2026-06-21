const { Router } = require('express');
const { bicicletaController: c } = require('../controllers/catalogoControllers');
const { autenticar } = require('../middlewares/auth');

const router = Router();
router.use(autenticar);

/**
 * @openapi
 * tags:
 *   name: Bicicletas
 *   description: CRUD de bicicletas (MongoDB) — requer autenticação
 *
 * /api/bicicletas:
 *   get:
 *     summary: Lista todas as bicicletas
 *     tags: [Bicicletas]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de bicicletas
 *   post:
 *     summary: Cadastra uma nova bicicleta
 *     tags: [Bicicletas]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [marca, modelo, tipo, tamanhoAro]
 *             properties:
 *               marca:
 *                 type: string
 *               modelo:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum: [mountain, speed, urbana, infantil, gravel, bmx]
 *               tamanhoAro:
 *                 type: number
 *               numeroDeMarchas:
 *                 type: integer
 *               cor:
 *                 type: string
 *     responses:
 *       201:
 *         description: Bicicleta criada
 *
 * /api/bicicletas/{id}:
 *   get:
 *     summary: Busca bicicleta por ID
 *     tags: [Bicicletas]
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
 *     summary: Atualiza bicicleta por ID
 *     tags: [Bicicletas]
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
 *     summary: Remove bicicleta por ID
 *     tags: [Bicicletas]
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
