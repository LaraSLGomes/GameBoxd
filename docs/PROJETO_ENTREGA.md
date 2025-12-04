# GamerBoxd - Documentação do Projeto

## 📌 Título do Projeto
**GamerBoxd - Sistema de Avaliação de Jogos**

Sistema inspirado no Letterboxd, implementado com arquitetura de microsserviços para gerenciamento e avaliação de jogos.

---

## 🏗️ Solução Arquitetural

### Visão Geral da Arquitetura

O sistema GamerBoxd é composto por dois microsserviços independentes que se comunicam via API REST:

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
│  - CRUD de games           │ /games │  - Valida jogos            │
│  - Frontend (React)        │  /:id  │  - CRUD de reviews         │
│                            │        │  - Ratings (1.0 - 5.0)     │
│  Porta: 8080              │        │  Porta: 3000               │
└──────────┬─────────────────┘        └──────────┬─────────────────┘
           │                                     │
           │                                     │
           ▼                                     ▼
┌────────────────────────────┐        ┌────────────────────────────┐
│   DATABASE (PostgreSQL)    │        │   DATABASE (PostgreSQL)    │
│                            │        │                            │
│  Tables:                   │        │  Tables:                   │
│  - games                   │        │  - reviews                 │
│  - [outras tabelas]        │        │    * id                    │
│                            │        │    * game_id               │
│                            │        │    * rating                │
│                            │        │    * comment               │
│                            │        │    * created_at            │
│                            │        │    * updated_at            │
└────────────────────────────┘        └────────────────────────────┘
```

### Descrição dos Microsserviços

#### 1. Game Service (Parceiro)
- **Responsabilidade**: Gerenciamento de jogos (CRUD)
- **Tecnologia**: Java + Spring Boot
- **Porta**: 8080
- **Banco de Dados**: PostgreSQL
- **Frontend**: Interface React para cadastro e visualização de jogos

#### 2. Review Service (Este Repositório)
- **Responsabilidade**: Gerenciamento de avaliações de jogos
- **Tecnologia**: Node.js + Express
- **Porta**: 3000
- **Banco de Dados**: PostgreSQL (independente)
- **Funcionalidades**:
  - Criar avaliações (rating de 1.0 a 5.0)
  - Listar todas as avaliações
  - Buscar avaliações por jogo
  - Validar existência do jogo no Game Service antes de criar review

### Comunicação Entre Microsserviços

**Fluxo de Criação de Review:**

```
1. Cliente → Frontend: Solicita criar review do jogo #123
   
2. Frontend → Review Service: POST /reviews
   Body: { gameId: 123, rating: 4.5, comment: "Ótimo jogo!" }
   
3. Review Service → Game Service: GET /games/123
   (Valida se o jogo existe)
   
4. Game Service → Review Service: Retorna dados do jogo ou 404
   
5. Review Service → PostgreSQL: Insere review (se jogo válido)
   
6. Review Service → Frontend: Retorna sucesso ou erro
   
7. Frontend → Cliente: Exibe confirmação
```

### Princípios Arquiteturais

1. **Independência de Dados**: Cada microsserviço possui seu próprio banco de dados PostgreSQL
2. **Baixo Acoplamento**: Comunicação apenas via API REST (HTTP)
3. **Alta Coesão**: Cada serviço tem responsabilidade única e bem definida
4. **Resiliência**: Tratamento de erros quando serviços estão offline

---

## 🎯 Funcionalidades

### Review Service (Minha Parte)

**Endpoints da API:**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /health | Health check do serviço |
| POST | /reviews | Criar nova review |
| GET | /reviews | Listar todas as reviews |
| GET | /reviews/game/:gameId | Listar reviews de um jogo específico |
| GET | /reviews/:id | Buscar review por ID |
| DELETE | /reviews/:id | Deletar review |

**Regras de Negócio:**
- Rating deve ser entre 1.0 e 5.0 (aceita decimais como 3.5)
- Jogo deve existir no Game Service antes de criar review
- Comentário é opcional (máximo 1000 caracteres)
- Validação automática via HTTP para o Game Service

**Modelo de Dados:**
```sql
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    game_id INTEGER NOT NULL,
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);
```

**Tecnologias:**
- Node.js 16+ + Express 4.18.2
- PostgreSQL + Sequelize ORM 6.35.0
- Axios 1.6.0 (comunicação HTTP)
- Dotenv 16.3.1 (variáveis de ambiente)

---

## 📦 Entrega

### Repositório GitHub
- **URL**: https://github.com/LaraSLGomes/GameBoxd
- **Visibilidade**: Público
- **Branch**: main

### Deploy em Nuvem
- **URL do Deploy**: [A ser definido após deploy]
- **Plataforma**: [Railway/Render/Azure - a definir]

### Estrutura do Repositório
```
GameBoxd/
├── src/
│   ├── config/          # Configurações do banco de dados
│   ├── controllers/     # Lógica de negócio
│   ├── models/          # Model Review (Sequelize)
│   └── routes/          # Rotas da API REST
├── docs/                # Documentação
├── server.js            # Servidor Express
├── package.json         # Dependências
├── .env.example         # Exemplo de variáveis de ambiente
└── README.md            # Instruções de instalação
```

---

## 👥 Equipe

- **Review Service (Backend)**: [Seu Nome]
- **Game Service (Backend + Frontend)**: [Nome do Parceiro]

---

**Data de Entrega**: Dezembro 2025  
**Disciplina**: Projeto e Arquitetura de Software  
**Professor**: Ronaldo
