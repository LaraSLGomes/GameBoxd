# 🎮 GamerBoxd - Review Service

Microsserviço de avaliações de jogos para o projeto GamerBoxd.

## 📋 Descrição

Este é o **Review Service**, responsável por gerenciar as avaliações (reviews) de jogos. Faz parte de uma arquitetura de microsserviços, comunicando-se com o **Game Service** (desenvolvido pelo parceiro do projeto) para validar os jogos antes de criar reviews.

## 🛠️ Tecnologias

- **Node.js** v16+
- **Express** 4.18.2
- **PostgreSQL** (banco de dados)
- **Sequelize** 6.35.0 (ORM)
- **Axios** 1.6.0 (comunicação HTTP)
- **Dotenv** 16.3.1 (variáveis de ambiente)

## 📁 Estrutura do Projeto

```
GameBoxd/
├── src/
│   ├── config/
│   │   ├── db.js              # Configuração do Sequelize
│   │   ├── createDatabase.js  # Script para criar database
│   │   └── migrate.js         # Script de migração
│   ├── controllers/
│   │   └── ReviewController.js # Lógica de negócio
│   ├── models/
│   │   └── Review.js          # Model de Review
│   └── routes/
│       └── reviewRoutes.js    # Rotas da API
├── server.js                  # Servidor Express
├── package.json
├── .env.example               # Exemplo de configuração
└── .gitignore
```

## 🚀 Configuração e Instalação

### 1️⃣ Instale as dependências
```bash
npm install
```

### 2️⃣ Configure o banco de dados

Crie o arquivo `.env` na raiz do projeto:

```env
# Configurações do Banco de Dados PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gamerboxd_reviews
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui

# URL do Game Service (servidor do parceiro)
GAME_SERVICE_URL=http://localhost:8080

# Porta do servidor
PORT=3000
```

### 3️⃣ Crie o banco de dados
```bash
npm run db:create
```

### 4️⃣ Execute a migração (cria as tabelas)
```bash
npm run db:migrate
```

### 5️⃣ Inicie o servidor
```bash
# Modo desenvolvimento (com nodemon)
npm run dev

# Modo produção
npm start
```

## 📡 Endpoints da API

### Health Check
```http
GET /health
```
Verifica se o servidor está rodando.

### Criar Review
```http
POST /reviews
Content-Type: application/json

{
  "gameId": 1,
  "rating": 4.5,
  "comment": "Jogo incrível!"
}
```

### Listar Todas as Reviews
```http
GET /reviews
```

### Buscar Reviews por Jogo
```http
GET /reviews/game/:gameId
```

### Buscar Review por ID
```http
GET /reviews/:id
```

### Deletar Review
```http
DELETE /reviews/:id
```

## 🗄️ Modelo de Dados

### Review
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | ID único (auto-incremento) |
| gameId | INTEGER | ID do jogo (referência ao Game Service) |
| rating | DECIMAL(2,1) | Avaliação de 1.0 a 5.0 |
| comment | TEXT | Comentário (opcional, máx 1000 caracteres) |
| createdAt | TIMESTAMP | Data de criação |
| updatedAt | TIMESTAMP | Data da última atualização |

## 🔗 Integração com Game Service

Antes de criar uma review, o sistema valida se o jogo existe fazendo uma requisição HTTP para o Game Service:

```javascript
// Exemplo de validação
GET http://localhost:8080/games/{gameId}
```

**Possíveis respostas:**
- ✅ Status 200: Jogo válido, review criada
- ❌ Status 404: Jogo não encontrado
- ❌ Status 503: Game Service indisponível

## 🧪 Scripts Disponíveis

```bash
npm start          # Inicia o servidor
npm run dev        # Inicia com nodemon (auto-restart)
npm run db:create  # Cria o banco de dados
npm run db:migrate # Executa migrações
```

## ⚙️ Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| DB_HOST | Host do PostgreSQL | localhost |
| DB_PORT | Porta do PostgreSQL | 5432 |
| DB_NAME | Nome do banco | gamerboxd_reviews |
| DB_USER | Usuário do banco | postgres |
| DB_PASSWORD | Senha do banco | sua_senha |
| GAME_SERVICE_URL | URL do Game Service | http://localhost:8080 |
| PORT | Porta do Review Service | 3000 |

## 🏗️ Arquitetura

Este microsserviço segue os princípios:
- **Independência**: Banco de dados próprio
- **Comunicação HTTP**: REST API entre serviços
- **Validação externa**: Consulta Game Service antes de criar reviews
- **Resiliência**: Tratamento de erros quando Game Service está offline

## 👥 Projeto Acadêmico

Desenvolvido como trabalho de microserviços:
- **Review Service (Backend)**: Gerenciamento de avaliações
- **Game Service (Parceiro)**: Gerenciamento de jogos
- **Frontend (Parceiro)**: Interface do usuário

## 📝 Licença

ISC
