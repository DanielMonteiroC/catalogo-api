# Catálogo API

API RESTful híbrida desenvolvida com **Node.js** e **Express**, utilizando dois bancos de dados distintos: **PostgreSQL** (relacional) para gerenciamento de usuários e **MongoDB** (NoSQL) para o catálogo de livros, bicicletas e marcas de tênis.

---

## 📋 Documentação Técnica

### Arquitetura e Tecnologias

Este projeto foi construído seguindo a arquitetura **MVC** (Model-View-Controller), separando claramente as responsabilidades entre modelos, controladores e rotas. A aplicação opera sobre dois contextos de persistência:

- **PostgreSQL + Sequelize ORM**: banco relacional utilizado para armazenar os dados de usuários. O Sequelize abstrai as queries SQL e gerencia automaticamente a sincronização do schema via `sync({ alter: true })`. O modelo `Usuario` utiliza hooks do Sequelize para aplicar hash nas senhas com `bcryptjs` antes de qualquer inserção ou atualização, garantindo que senhas em texto puro nunca sejam gravadas.

- **MongoDB + Mongoose ODM**: banco NoSQL orientado a documentos, utilizado para os três recursos do catálogo: livros, bicicletas e marcas de tênis. A escolha do MongoDB nesses contextos se justifica pela flexibilidade do schema (documentos podem ter campos variáveis) e pela escalabilidade horizontal que esse tipo de banco oferece. Cada modelo Mongoose define validações na camada de schema, como campos obrigatórios, enumerações e limites numéricos.

### Autenticação e Autorização

A autenticação é implementada com **JWT (JSON Web Token)**. Ao realizar login com credenciais válidas, o servidor gera um token assinado com uma chave secreta definida via variável de ambiente (`JWT_SECRET`). Esse token deve ser enviado em todas as requisições a rotas protegidas, no header `Authorization` no formato `Bearer <token>`. O middleware `autenticar` valida e decodifica o token, injetando o ID e o perfil do usuário na requisição. Um segundo middleware, `autorizar`, possibilita a restrição de rotas por perfil (`admin` ou `comum`).

### Segurança (OWASP Top 10)

Foram aplicadas as seguintes proteções baseadas nas diretrizes da OWASP:

- **Helmet.js**: define automaticamente headers HTTP de segurança (como `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`), mitigando ataques como clickjacking e XSS via headers.
- **express-rate-limit**: limita a 100 requisições por IP a cada 15 minutos, reduzindo o risco de ataques de força bruta e abuso de API (relacionado a *Security Misconfiguration* e *Broken Authentication*).
- **Limite de payload**: o `express.json({ limit: '50kb' })` previne ataques de negação de serviço por payload excessivo.
- **Hash de senhas**: senhas nunca são armazenadas em texto puro; o `bcryptjs` com fator de custo 12 é utilizado.
- **Mensagens genéricas**: erros de autenticação retornam a mesma mensagem independente de o e-mail ou a senha estarem errados, evitando enumeração de usuários.
- **Usuário sem root no container**: o Dockerfile cria e utiliza um usuário sem privilégios para executar a aplicação.

Relendo o README, a documentação escrita já explica bastante as decisões, mas faltam justificativas explícitas para várias escolhas. Vou apontar o que adicionar:

---

### Decisões de Projeto

**Por que dois bancos de dados?**
A separação não é arbitrária. Dados de usuários têm estrutura fixa, relações bem definidas e exigem garantias de consistência (ACID) — o PostgreSQL é ideal para isso. Já os itens do catálogo (livros, bicicletas, marcas de tênis) tendem a ter campos opcionais variáveis por domínio e podem crescer em volume sem necessidade de JOINs complexos; o MongoDB oferece flexibilidade de schema e escalabilidade horizontal para esses casos.

**Por que Sequelize e Mongoose em vez de queries brutas?**
Os ORMs/ODMs centralizam validações, hooks e conversões de tipo em um único lugar (o model), evitando que regras como "senha sempre em hash" precisem ser repetidas em cada controller. Isso reduz a superfície de bugs e facilita manutenção.

**Por que a fábrica `criarCrudNoSQL()`?**
Os três recursos NoSQL têm exatamente o mesmo comportamento de CRUD. Duplicar o código três vezes criaria três pontos de falha para qualquer mudança futura (ex: adicionar paginação ou logs). A fábrica centraliza isso em um único lugar e os controllers específicos apenas declaram qual model e qual nome de recurso usar.

**Por que JWT e não sessões?**
A aplicação é uma API stateless consumida por diferentes clientes (web, mobile, outros serviços). JWT elimina a necessidade de armazenar estado de sessão no servidor, facilitando escalabilidade horizontal — qualquer instância da API consegue validar o token sem consultar um banco de sessões centralizado.

**Por que o Dockerfile usa multi-stage build e usuário sem root?**
O multi-stage descarta as ferramentas de build da imagem final, reduzindo o tamanho e a superfície de ataque do container em produção. Rodar como usuário sem privilégios (`appuser`) limita o impacto caso haja uma vulnerabilidade explorada dentro do container — o processo não terá permissão de escrita no sistema de arquivos do host.

**Por que `sync({ alter: true })` no servidor e `sync({ force: true })` nos testes?**
Em produção, `alter` aplica apenas as diferenças de schema sem apagar dados existentes. Nos testes, `force` recria as tabelas do zero a cada execução, garantindo isolamento total entre as rodadas de teste sem depender de scripts de limpeza manuais.

### Estrutura de Diretórios

```
catalogo-api/
├── src/
│   ├── config/         # Conexões com PostgreSQL, MongoDB e Swagger
│   ├── controllers/    # Lógica de negócio (auth, usuário, catálogo)
│   ├── middlewares/    # JWT auth, tratamento de erros
│   ├── models/         # Schemas Mongoose e modelos Sequelize
│   └── routes/         # Definição das rotas com documentação Swagger
├── tests/
│   └── api.test.js     # Testes de integração (Jest + Supertest)
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── package.json
```

### Testes de Integração

Os testes foram escritos com **Jest** e **Supertest**, cobrindo todos os endpoints da aplicação (CRUD completo de usuários, livros, bicicletas e marcas de tênis, além dos fluxos de autenticação). O ambiente de teste usa os mesmos bancos com dados isolados, recriando as tabelas SQL via `sync({ force: true })` e limpando as coleções MongoDB no início de cada execução.

### Documentação da API

A documentação interativa é gerada automaticamente pelo **Swagger** (via `swagger-jsdoc` + `swagger-ui-express`), usando anotações JSDoc nas rotas. Disponível em `http://localhost:3000/api-docs` após iniciar a aplicação.

---

## 🚀 Execução com Docker (fluxo principal)

### Pré-requisitos
- Docker e Docker Compose instalados

### Passos

```bash
# 1. Clone o repositório
git clone <URL_DO_REPOSITORIO>
cd catalogo-api

# 2. Copie o arquivo de ambiente
cp .env.example .env
# Edite o .env e defina JWT_SECRET, PG_PASSWORD etc.

# 3. Suba os containers
docker compose up --build

# A API estará disponível em http://localhost:3000
# Documentação Swagger: http://localhost:3000/api-docs
```

### Parar os containers

```bash
docker compose down
# Para remover também os volumes (dados):
docker compose down -v
```

---

## 🧪 Executar Testes

Os testes requerem MongoDB e PostgreSQL acessíveis. A forma mais prática é via Docker:

```bash
# Com os bancos já rodando via docker compose:
docker compose run --rm api sh -c "npm test"
```

Ou localmente (com os bancos configurados no .env):

```bash
npm test
```

---

## 🔗 Endpoints Resumidos

| Método | Rota                    | Auth | Descrição                     |
|--------|-------------------------|------|-------------------------------|
| POST   | /api/usuarios           | ❌   | Cria usuário                  |
| POST   | /api/auth/login         | ❌   | Login — retorna JWT           |
| GET    | /api/usuarios           | ✅   | Lista usuários                |
| GET    | /api/usuarios/:id       | ✅   | Busca usuário por ID          |
| PUT    | /api/usuarios/:id       | ✅   | Atualiza usuário              |
| DELETE | /api/usuarios/:id       | ✅   | Remove usuário                |
| GET    | /api/livros             | ✅   | Lista livros                  |
| POST   | /api/livros             | ✅   | Cria livro                    |
| GET    | /api/livros/:id         | ✅   | Busca livro por ID            |
| PUT    | /api/livros/:id         | ✅   | Atualiza livro                |
| DELETE | /api/livros/:id         | ✅   | Remove livro                  |
| GET    | /api/bicicletas         | ✅   | Lista bicicletas              |
| POST   | /api/bicicletas         | ✅   | Cria bicicleta                |
| GET    | /api/bicicletas/:id     | ✅   | Busca bicicleta por ID        |
| PUT    | /api/bicicletas/:id     | ✅   | Atualiza bicicleta            |
| DELETE | /api/bicicletas/:id     | ✅   | Remove bicicleta              |
| GET    | /api/marcas-tenis       | ✅   | Lista marcas de tênis         |
| POST   | /api/marcas-tenis       | ✅   | Cria marca de tênis           |
| GET    | /api/marcas-tenis/:id   | ✅   | Busca marca por ID            |
| PUT    | /api/marcas-tenis/:id   | ✅   | Atualiza marca                |
| DELETE | /api/marcas-tenis/:id   | ✅   | Remove marca                  |
