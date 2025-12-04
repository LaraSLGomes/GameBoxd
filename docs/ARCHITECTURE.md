# 🏗️ Arquitetura do Sistema GamerBoxd

## 📋 Visão Geral do Projeto

**GamerBoxd** é um sistema de avaliação de jogos inspirado no Letterboxd, implementado com arquitetura de microsserviços.

## 🎯 Microsserviços

### 1. Game Service (Parceiro)
- **Responsabilidade**: Gerenciamento de jogos e usuários
- **Tecnologia**: Java + Spring Boot
- **Porta**: 8080
- **Banco de Dados**: [MySQL/PostgreSQL - definido pelo parceiro]

### 2. Review Service (Este Repositório)
- **Responsabilidade**: Gerenciamento de avaliações de jogos
- **Tecnologia**: Node.js + Express
- **Porta**: 3000
- **Banco de Dados**: PostgreSQL

## 🔄 Diagrama de Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENTE                              │
│                     (Navegador Web)                          │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ HTTP
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                         │
│                  Hospedado pelo Parceiro                     │
└────────┬──────────────────────────────────────────┬─────────┘
         │                                           │
         │ REST API                                  │ REST API
         │ (HTTP)                                    │ (HTTP)
         │                                           │
         ▼                                           ▼
┌────────────────────────────┐        ┌────────────────────────────┐
│     GAME SERVICE           │        │     REVIEW SERVICE         │
│   (Microsserviço Java)     │◄───────┤   (Microsserviço Node.js)  │
│                            │  HTTP  │                            │
│  - Gerencia jogos          │  GET   │  - Gerencia reviews        │
│  - Gerencia usuários       │ /games │  - Valida jogos            │
│  - CRUD de games           │  /:id  │  - CRUD de reviews         │
│                            │        │  - Ratings (1.0 - 5.0)     │
│  Porta: 8080              │        │  Porta: 3000               │
└──────────┬─────────────────┘        └──────────┬─────────────────┘
           │                                     │
           │                                     │
           ▼                                     ▼
┌────────────────────────────┐        ┌────────────────────────────┐
│   DATABASE (MySQL/PG)      │        │   DATABASE (PostgreSQL)    │
│                            │        │                            │
│  Tables:                   │        │  Tables:                   │
│  - games                   │        │  - reviews                 │
│  - users                   │        │    * id                    │
│  - [outras tabelas]        │        │    * game_id               │
│                            │        │    * rating                │
│                            │        │    * comment               │
│                            │        │    * created_at            │
│                            │        │    * updated_at            │
└────────────────────────────┘        └────────────────────────────┘
```

## 🔗 Comunicação Entre Microsserviços

### Fluxo de Criação de Review

```
1. Cliente → Frontend: "Criar review do jogo #123"
   
2. Frontend → Review Service (POST /reviews)
   Body: { gameId: 123, rating: 4.5, comment: "Ótimo jogo!" }
   
3. Review Service → Game Service (GET /games/123)
   Valida se o jogo existe
   
4. Game Service → Review Service
   Retorna dados do jogo ou erro 404
   
5. Review Service → Database
   Se jogo válido: Insere review no PostgreSQL
   
6. Review Service → Frontend
   Retorna sucesso ou erro
   
7. Frontend → Cliente
   Exibe mensagem de confirmação
```

## 📡 Endpoints Públicos

### Review Service (http://localhost:3000)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /health | Health check do serviço |
| POST | /reviews | Criar nova review |
| GET | /reviews | Listar todas as reviews |
| GET | /reviews/game/:gameId | Listar reviews de um jogo |
| GET | /reviews/:id | Buscar review específica |
| DELETE | /reviews/:id | Deletar review |

### Game Service (http://localhost:8080)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /games/:id | Buscar jogo por ID (usado pelo Review Service) |

## 🔒 Princípios Arquiteturais Aplicados

### 1. **Independência de Dados**
- Cada microsserviço possui seu próprio banco de dados
- Não há acesso direto entre bancos de dados
- Comunicação apenas via API REST

### 2. **Baixo Acoplamento**
- Microsserviços se comunicam apenas via HTTP
- Mudanças no Game Service não afetam o Review Service (desde que a API seja mantida)

### 3. **Alta Coesão**
- Cada serviço tem responsabilidade única e bem definida
- Review Service: apenas reviews
- Game Service: apenas jogos e usuários

### 4. **Resiliência**
- Review Service trata erros quando Game Service está offline
- Retorna mensagens claras de erro para o cliente

## 🚀 Tecnologias Utilizadas

### Review Service
- **Runtime**: Node.js 16+
- **Framework**: Express 4.18.2
- **ORM**: Sequelize 6.35.0
- **Banco de Dados**: PostgreSQL
- **HTTP Client**: Axios 1.6.0
- **Variáveis de Ambiente**: Dotenv 16.3.1

### Comunicação
- **Protocolo**: HTTP/REST
- **Formato de Dados**: JSON
- **Autenticação**: [A definir - se necessário]

## 📊 Modelo de Dados - Review Service

### Tabela: reviews

```sql
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    game_id INTEGER NOT NULL,
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON COLUMN reviews.game_id IS 'ID do jogo (referência externa ao Game Service)';
COMMENT ON COLUMN reviews.rating IS 'Avaliação de 1.0 a 5.0 estrelas';
COMMENT ON COLUMN reviews.comment IS 'Comentário opcional sobre o jogo';
```

### Regras de Negócio

1. **Rating**: Deve ser entre 1.0 e 5.0 (aceita decimais como 3.5)
2. **Game ID**: Deve existir no Game Service antes de criar review
3. **Comment**: Opcional, máximo 1000 caracteres
4. **Validação**: Jogo é validado via HTTP no Game Service antes de criar review

## 🔧 Variáveis de Ambiente

```env
# Review Service
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gamerboxd_reviews
DB_USER=postgres
DB_PASSWORD=sua_senha
GAME_SERVICE_URL=http://localhost:8080
```

## 📈 Escalabilidade

- Cada microsserviço pode ser escalado independentemente
- Review Service pode ter múltiplas instâncias atrás de um load balancer
- Banco de dados PostgreSQL pode usar replicação para leitura

## 🛡️ Tratamento de Erros

### Cenários de Erro no Review Service

| Erro | Status HTTP | Resposta |
|------|-------------|----------|
| Game Service offline | 503 | "Serviço de jogos indisponível" |
| Jogo não encontrado | 400 | "Jogo inválido ou não encontrado" |
| Rating inválido | 400 | "Rating deve ser entre 1.0 e 5.0" |
| Campos obrigatórios faltando | 400 | "gameId e rating são obrigatórios" |
| Erro no banco de dados | 500 | "Erro interno ao criar review" |

---

**Última atualização**: Dezembro 2025  
**Versão**: 1.0.0
