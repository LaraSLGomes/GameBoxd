# 📐 Diagrama de Classes - Review Service

## Visão Geral

Este documento apresenta o diagrama de classes do **Review Service**, microsserviço responsável pelo gerenciamento de avaliações de jogos no sistema GamerBoxd.

## 🏗️ Diagrama UML Simplificado

```
┌─────────────────────────────────────────────────────────────┐
│                         <<Express App>>                      │
│                           server.js                          │
├─────────────────────────────────────────────────────────────┤
│ - app: Express                                               │
│ - PORT: number                                               │
├─────────────────────────────────────────────────────────────┤
│ + initializeServer(): void                                   │
│ + setupMiddlewares(): void                                   │
│ + setupRoutes(): void                                        │
│ + startServer(): void                                        │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ uses
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                     <<Router>>                               │
│                   reviewRoutes.js                            │
├─────────────────────────────────────────────────────────────┤
│ - router: Express.Router                                     │
├─────────────────────────────────────────────────────────────┤
│ + POST   /reviews                                            │
│ + GET    /reviews                                            │
│ + GET    /reviews/game/:gameId                               │
│ + GET    /reviews/:id                                        │
│ + DELETE /reviews/:id                                        │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ delegates to
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    <<Controller>>                            │
│                  ReviewController.js                         │
├─────────────────────────────────────────────────────────────┤
│ - axios: AxiosInstance                                       │
│ - Review: Model                                              │
├─────────────────────────────────────────────────────────────┤
│ + createReview(req, res): Promise<Response>                  │
│ + getAllReviews(req, res): Promise<Response>                 │
│ + getReviewsByGame(req, res): Promise<Response>              │
│ + getReviewById(req, res): Promise<Response>                 │
│ + deleteReview(req, res): Promise<Response>                  │
│ - validateGame(gameId): Promise<boolean>                     │
└────────────┬──────────────────────┬─────────────────────────┘
             │                      │
             │ uses                 │ uses
             ▼                      ▼
┌──────────────────────┐   ┌────────────────────────────────┐
│   <<HTTP Client>>    │   │        <<Model>>               │
│      axios           │   │       Review.js                │
├──────────────────────┤   ├────────────────────────────────┤
│ - baseURL: string    │   │ - id: INTEGER (PK)             │
│ - timeout: number    │   │ - gameId: INTEGER (NOT NULL)   │
├──────────────────────┤   │ - rating: DECIMAL(2,1)         │
│ + get(): Promise     │   │ - comment: TEXT                │
│ + post(): Promise    │   │ - createdAt: TIMESTAMP         │
└──────────────────────┘   │ - updatedAt: TIMESTAMP         │
                           ├────────────────────────────────┤
                           │ + findAll(): Promise<Review[]> │
                           │ + findByPk(id): Promise<Review>│
                           │ + create(data): Promise<Review>│
                           │ + destroy(): Promise<void>     │
                           └────────┬───────────────────────┘
                                    │
                                    │ persists to
                                    ▼
                           ┌────────────────────────────────┐
                           │     <<Database>>               │
                           │   sequelize (ORM)              │
                           ├────────────────────────────────┤
                           │ - host: string                 │
                           │ - port: number                 │
                           │ - database: string             │
                           │ - username: string             │
                           │ - password: string             │
                           │ - dialect: 'postgres'          │
                           ├────────────────────────────────┤
                           │ + authenticate(): Promise      │
                           │ + sync(): Promise              │
                           │ + query(sql): Promise          │
                           └────────┬───────────────────────┘
                                    │
                                    │ connects to
                                    ▼
                           ┌────────────────────────────────┐
                           │      PostgreSQL Database       │
                           │    gamerboxd_reviews           │
                           ├────────────────────────────────┤
                           │  Table: reviews                │
                           │  - id (SERIAL PRIMARY KEY)     │
                           │  - game_id (INTEGER)           │
                           │  - rating (DECIMAL(2,1))       │
                           │  - comment (TEXT)              │
                           │  - created_at (TIMESTAMP)      │
                           │  - updated_at (TIMESTAMP)      │
                           └────────────────────────────────┘
```

## 📦 Descrição das Classes

### 1. **Server (server.js)**
**Responsabilidade**: Ponto de entrada da aplicação

**Atributos**:
- `app`: Instância do Express
- `PORT`: Porta do servidor (padrão: 3000)

**Métodos**:
- `initializeServer()`: Inicializa configurações
- `setupMiddlewares()`: Configura CORS, JSON parser, etc.
- `setupRoutes()`: Registra rotas da API
- `startServer()`: Inicia servidor HTTP

---

### 2. **ReviewRoutes (reviewRoutes.js)**
**Responsabilidade**: Definir rotas HTTP e mapear para controllers

**Tipo**: Express Router

**Rotas**:
- `POST /reviews` → `createReview()`
- `GET /reviews` → `getAllReviews()`
- `GET /reviews/game/:gameId` → `getReviewsByGame()`
- `GET /reviews/:id` → `getReviewById()`
- `DELETE /reviews/:id` → `deleteReview()`

---

### 3. **ReviewController (ReviewController.js)**
**Responsabilidade**: Lógica de negócio e orquestração

**Dependências**:
- `Review` (Model)
- `axios` (HTTP client)

**Métodos Públicos**:

#### `createReview(req, res): Promise<Response>`
- Valida entrada (gameId, rating)
- Valida se jogo existe no Game Service
- Cria review no banco de dados
- Retorna review criado ou erro

**Fluxo**:
```
1. Valida campos obrigatórios (gameId, rating)
2. Valida range do rating (1.0 - 5.0)
3. Chama validateGame(gameId)
4. Se válido: Review.create()
5. Retorna 201 + dados da review
```

#### `getAllReviews(req, res): Promise<Response>`
- Busca todas as reviews
- Ordena por data de criação (DESC)
- Retorna array de reviews

#### `getReviewsByGame(req, res): Promise<Response>`
- Busca reviews de um jogo específico
- Filtra por gameId
- Retorna array de reviews

#### `getReviewById(req, res): Promise<Response>`
- Busca review por ID
- Retorna review ou 404

#### `deleteReview(req, res): Promise<Response>`
- Busca review por ID
- Deleta do banco
- Retorna sucesso ou 404

**Método Privado**:

#### `validateGame(gameId): Promise<boolean>`
- Faz requisição HTTP para Game Service
- Endpoint: `GET ${GAME_SERVICE_URL}/games/${gameId}`
- Timeout: 5 segundos
- Retorna true se jogo existe, false caso contrário

**Tratamento de Erros**:
- `400`: Validação de entrada
- `404`: Recurso não encontrado
- `503`: Game Service indisponível
- `500`: Erro interno

---

### 4. **Review (Review.js)**
**Responsabilidade**: Modelo de dados (ORM)

**Tipo**: Sequelize Model

**Atributos**:
- `id`: INTEGER (Primary Key, Auto Increment)
- `gameId`: INTEGER (NOT NULL)
- `rating`: DECIMAL(2,1) (NOT NULL, MIN: 1.0, MAX: 5.0)
- `comment`: TEXT (NULLABLE, MAX: 1000 chars)
- `createdAt`: TIMESTAMP (Auto)
- `updatedAt`: TIMESTAMP (Auto)

**Validações**:
- `rating`: Deve estar entre 1.0 e 5.0
- `comment`: Máximo 1000 caracteres
- `gameId`: Obrigatório

**Métodos Herdados do Sequelize**:
- `findAll(options)`: Busca múltiplas reviews
- `findByPk(id)`: Busca por chave primária
- `create(data)`: Cria nova review
- `destroy()`: Deleta review

---

### 5. **Sequelize (db.js)**
**Responsabilidade**: Gerenciador de conexão com banco de dados

**Tipo**: ORM (Object-Relational Mapping)

**Configuração**:
```javascript
{
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}
```

**Métodos**:
- `authenticate()`: Testa conexão
- `sync()`: Sincroniza models com banco
- `query()`: Executa SQL bruto

---

### 6. **Axios**
**Responsabilidade**: Cliente HTTP para comunicação com Game Service

**Configuração**:
- `baseURL`: `process.env.GAME_SERVICE_URL`
- `timeout`: 5000ms
- `headers`: `Content-Type: application/json`

**Uso**:
```javascript
const response = await axios.get(`${GAME_SERVICE_URL}/games/${gameId}`);
```

---

## 🔄 Fluxo de Criação de Review (Sequence Diagram)

```
Cliente          ReviewRoutes     ReviewController    Axios       Review Model    PostgreSQL
  │                   │                   │             │              │              │
  │  POST /reviews    │                   │             │              │              │
  ├──────────────────►│                   │             │              │              │
  │                   │  createReview()   │             │              │              │
  │                   ├──────────────────►│             │              │              │
  │                   │                   │ GET /games/:id            │              │
  │                   │                   ├────────────►│              │              │
  │                   │                   │             │              │              │
  │                   │                   │◄────────────┤              │              │
  │                   │                   │  200 OK     │              │              │
  │                   │                   │             │              │              │
  │                   │                   │     create(data)           │              │
  │                   │                   ├────────────────────────────►│              │
  │                   │                   │                            │  INSERT      │
  │                   │                   │                            ├─────────────►│
  │                   │                   │                            │              │
  │                   │                   │                            │◄─────────────┤
  │                   │                   │◄────────────────────────────┤              │
  │                   │◄──────────────────┤                            │              │
  │◄──────────────────┤                   │                            │              │
  │   201 Created     │                   │                            │              │
  │   + review data   │                   │                            │              │
```

## 📊 Relacionamentos

### Dependências
- `Server` → `ReviewRoutes`: Registra rotas
- `ReviewRoutes` → `ReviewController`: Delega lógica
- `ReviewController` → `Review`: Manipula dados
- `ReviewController` → `Axios`: Valida jogos
- `Review` → `Sequelize`: Persiste dados
- `Sequelize` → `PostgreSQL`: Conexão com banco

### Comunicação Externa
- `ReviewController` → `Game Service`: Validação via HTTP

## 🎯 Princípios SOLID Aplicados

### Single Responsibility Principle (SRP)
- Cada classe tem uma responsabilidade única
- Controller: lógica de negócio
- Model: representação de dados
- Routes: mapeamento HTTP

### Dependency Inversion Principle (DIP)
- Controller depende de abstrações (Model, Axios)
- Não depende de implementações concretas

### Open/Closed Principle (OCP)
- Fácil adicionar novos endpoints sem modificar código existente
- Basta adicionar novas rotas e métodos no controller

---

**Autor**: Review Service Team  
**Data**: Dezembro 2025  
**Versão**: 1.0.0
