require('dotenv').config();

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const sequelize = require('../src/config/postgres');
const conectarMongoDB = require('../src/config/mongodb');

let token = '';
let usuarioId;
let livroId;
let bicicletaId;
let marcaTenisId;

// ─── Configuração dos bancos de dados ────────────────────────────────────────
beforeAll(async () => {
  // PostgreSQL: recria as tabelas para o ambiente de teste
  await sequelize.sync({ force: true });

  // MongoDB: conecta se ainda não estiver conectado
  if (mongoose.connection.readyState === 0) {
    await conectarMongoDB();
  }

  // Limpa coleções NoSQL antes de rodar os testes
  await mongoose.connection.collection('livros').deleteMany({});
  await mongoose.connection.collection('bicicletas').deleteMany({});
  await mongoose.connection.collection('marcatenis').deleteMany({});
});

afterAll(async () => {
  await sequelize.close();
  await mongoose.connection.close();
});

// ─── 1. USUÁRIOS (SQL) ───────────────────────────────────────────────────────
describe('👤 Usuários', () => {
  it('POST /api/usuarios — deve criar um novo usuário', async () => {
    const res = await request(app).post('/api/usuarios').send({
      nomeCompleto: 'Maria Souza',
      email: 'maria@catalogo.com',
      senha: 'Senha@2025',
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe('maria@catalogo.com');
    expect(res.body).not.toHaveProperty('senha');

    usuarioId = res.body.id;
  });

  it('POST /api/usuarios — deve rejeitar e-mail duplicado', async () => {
    const res = await request(app).post('/api/usuarios').send({
      nomeCompleto: 'Maria Clone',
      email: 'maria@catalogo.com',
      senha: 'outrasenha',
    });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('erro');
  });

  it('GET /api/usuarios — deve bloquear sem token', async () => {
    const res = await request(app).get('/api/usuarios');
    expect(res.status).toBe(401);
  });
});

// ─── 2. AUTENTICAÇÃO ─────────────────────────────────────────────────────────
describe('🔐 Autenticação', () => {
  it('POST /api/auth/login — deve retornar token JWT com credenciais válidas', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'maria@catalogo.com',
      senha: 'Senha@2025',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.usuario.email).toBe('maria@catalogo.com');

    token = res.body.token;
  });

  it('POST /api/auth/login — deve rejeitar credenciais inválidas', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'maria@catalogo.com',
      senha: 'senhaerrada',
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('erro');
  });

  it('POST /api/auth/login — deve rejeitar body incompleto', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'maria@catalogo.com' });
    expect(res.status).toBe(400);
  });
});

// ─── 3. USUÁRIOS autenticados ────────────────────────────────────────────────
describe('👤 Usuários (autenticados)', () => {
  it('GET /api/usuarios — deve listar usuários com token válido', async () => {
    const res = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/usuarios/:id — deve buscar usuário por ID', async () => {
    const res = await request(app)
      .get(`/api/usuarios/${usuarioId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(usuarioId);
  });

  it('GET /api/usuarios/:id — deve retornar 404 para ID inexistente', async () => {
    const res = await request(app)
      .get('/api/usuarios/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it('PUT /api/usuarios/:id — deve atualizar o nome do usuário', async () => {
    const res = await request(app)
      .put(`/api/usuarios/${usuarioId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nomeCompleto: 'Maria Souza Atualizada' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('mensagem');
  });

  it('DELETE /api/usuarios/:id — deve remover o usuário', async () => {
    // Cria usuário extra para remover
    const criado = await request(app).post('/api/usuarios').send({
      nomeCompleto: 'Para Deletar',
      email: 'deletar@catalogo.com',
      senha: 'Deletar@123',
    });

    const res = await request(app)
      .delete(`/api/usuarios/${criado.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('mensagem');
  });
});

// ─── 4. LIVROS (NoSQL) ───────────────────────────────────────────────────────
describe('📚 Livros (NoSQL)', () => {
  it('GET /api/livros — deve bloquear sem token', async () => {
    const res = await request(app).get('/api/livros');
    expect(res.status).toBe(401);
  });

  it('POST /api/livros — deve criar um livro com token', async () => {
    const res = await request(app)
      .post('/api/livros')
      .set('Authorization', `Bearer ${token}`)
      .send({
        titulo: 'Dom Casmurro',
        autor: 'Machado de Assis',
        anoPublicacao: 1899,
        genero: 'Romance',
        numeroPaginas: 256,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.titulo).toBe('Dom Casmurro');

    livroId = res.body._id;
  });

  it('GET /api/livros — deve listar os livros', async () => {
    const res = await request(app)
      .get('/api/livros')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /api/livros/:id — deve buscar livro por ID', async () => {
    const res = await request(app)
      .get(`/api/livros/${livroId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(livroId);
  });

  it('PUT /api/livros/:id — deve atualizar o livro', async () => {
    const res = await request(app)
      .put(`/api/livros/${livroId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ genero: 'Literatura Brasileira' });

    expect(res.status).toBe(200);
    expect(res.body.genero).toBe('Literatura Brasileira');
  });

  it('DELETE /api/livros/:id — deve remover o livro', async () => {
    const res = await request(app)
      .delete(`/api/livros/${livroId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('mensagem');
  });

  it('GET /api/livros/:id — deve retornar 404 após remoção', async () => {
    const res = await request(app)
      .get(`/api/livros/${livroId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});

// ─── 5. BICICLETAS (NoSQL) ───────────────────────────────────────────────────
describe('🚲 Bicicletas (NoSQL)', () => {
  it('POST /api/bicicletas — deve criar uma bicicleta', async () => {
    const res = await request(app)
      .post('/api/bicicletas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        marca: 'Trek',
        modelo: 'Marlin 7',
        tipo: 'mountain',
        tamanhoAro: 29,
        numeroDeMarchas: 21,
        cor: 'azul',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.marca).toBe('Trek');

    bicicletaId = res.body._id;
  });

  it('GET /api/bicicletas — deve listar bicicletas', async () => {
    const res = await request(app)
      .get('/api/bicicletas')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/bicicletas/:id — deve buscar bicicleta por ID', async () => {
    const res = await request(app)
      .get(`/api/bicicletas/${bicicletaId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(bicicletaId);
  });

  it('PUT /api/bicicletas/:id — deve atualizar a bicicleta', async () => {
    const res = await request(app)
      .put(`/api/bicicletas/${bicicletaId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ cor: 'vermelho' });

    expect(res.status).toBe(200);
    expect(res.body.cor).toBe('vermelho');
  });

  it('DELETE /api/bicicletas/:id — deve remover a bicicleta', async () => {
    const res = await request(app)
      .delete(`/api/bicicletas/${bicicletaId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});

// ─── 6. MARCAS DE TÊNIS (NoSQL) ──────────────────────────────────────────────
describe('👟 Marcas de Tênis (NoSQL)', () => {
  it('POST /api/marcas-tenis — deve criar uma marca de tênis', async () => {
    const res = await request(app)
      .post('/api/marcas-tenis')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Asics',
        paisSede: 'Japão',
        anoFundacao: 1949,
        segmentoFoco: 'corrida',
        website: 'https://www.asics.com',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.nome).toBe('Asics');

    marcaTenisId = res.body._id;
  });

  it('GET /api/marcas-tenis — deve listar marcas de tênis', async () => {
    const res = await request(app)
      .get('/api/marcas-tenis')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/marcas-tenis/:id — deve buscar marca por ID', async () => {
    const res = await request(app)
      .get(`/api/marcas-tenis/${marcaTenisId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(marcaTenisId);
  });

  it('PUT /api/marcas-tenis/:id — deve atualizar a marca', async () => {
    const res = await request(app)
      .put(`/api/marcas-tenis/${marcaTenisId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ segmentoFoco: 'geral' });

    expect(res.status).toBe(200);
    expect(res.body.segmentoFoco).toBe('geral');
  });

  it('DELETE /api/marcas-tenis/:id — deve remover a marca', async () => {
    const res = await request(app)
      .delete(`/api/marcas-tenis/${marcaTenisId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('mensagem');
  });

  it('GET /api/marcas-tenis/:id — deve retornar 404 após remoção', async () => {
    const res = await request(app)
      .get(`/api/marcas-tenis/${marcaTenisId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
