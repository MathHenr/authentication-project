# 🔐 Projeto de Autenticação com Segurança

Um projeto educacional desenvolvido para aprender e implementar funcionalidades robustas de **autenticação de usuários** e **segurança** em uma aplicação Node.js/Express.

## 📋 Objetivo

Este projeto foi criado com a finalidade de compreender e praticar:

- ✅ Implementação de autenticação de usuários
- ✅ Hashing seguro de senhas
- ✅ Geração e validação de tokens JWT
- ✅ Proteção contra força bruta (múltiplas tentativas de login)
- ✅ Detecção e bloqueio de IPs suspeitos/desconhecidos
- ✅ Middlewares de autenticação

## 🛡️ Funcionalidades de Segurança

### 1. **Proteção de Senhas**

- Senhas são hasheadas usando **bcryptjs** com salt de 10 rounds
- Nunca são armazenadas em texto plano no banco de dados
- Comparação segura durante o login

### 2. **Bloqueio por Múltiplas Tentativas**

- Após **5 tentativas** de login inválidas, a conta é bloqueada
- Bloqueio dura **1 minuto** antes de permitir novas tentativas
- Contador de tentativas é resetado após login bem-sucedido

### 3. **Detecção de IPs Estranhos**

- Sistema registra e monitora IPs conhecidos de cada usuário
- Primeiro login: IP é automaticamente adicionado à lista de IPs conhecidos
- Tentativas de login de IPs desconhecidos geram alertas de segurança
- Novos IPs autorizados são adicionados após login bem-sucedido

### 4. **Autenticação com JWT**

- Tokens JWT com expiração de **24 horas**
- Bearer token obrigatório em rotas protegidas
- Validação de token no middleware de autenticação

## 🚀 Tecnologias Utilizadas

| Tecnologia           | Versão | Propósito                      |
| -------------------- | ------ | ------------------------------ |
| **Express**          | 5.2.1  | Framework web                  |
| **MongoDB/Mongoose** | 9.2.1  | Banco de dados e ODM           |
| **bcryptjs**         | 3.0.3  | Hashing de senhas              |
| **jsonwebtoken**     | 9.0.3  | Geração e validação de JWT     |
| **dotenv**           | 17.3.1 | Variáveis de ambiente          |
| **nodemon**          | 3.1.11 | Auto-reload em desenvolvimento |

## 📁 Estrutura do Projeto

```
authentication/
├── src/
│   ├── server.js              # Configuração principal do servidor
│   ├── route.js               # Definição de rotas
│   ├── config/
│   │   └── db.js              # Conexão com MongoDB
│   ├── controllers/
│   │   └── AuthController.js  # Lógica de autenticação
│   ├── middlewares/
│   │   └── auth.js            # Middleware de validação JWT
│   └── models/
│       └── User.js            # Schema do usuário
├── package.json
└── .env                        # Variáveis de ambiente
```

## 🔧 Instalação e Configuração

### 1. Clone ou navegue ao projeto

```bash
cd /path/to/authentication
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/authentication
APP_SECRET=sua_chave_secreta_muito_segura_aqui
```

### 4. Inicie o servidor

```bash
npm run dev
```

O servidor iniciará em `http://localhost:3000`

## 📡 API Endpoints

### 1. **Registro de Usuário**

```http
POST /register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta (201 Created):**

```json
{
  "message": "Usuário cadastrado!",
  "user": {
    "_id": "...",
    "name": "João Silva",
    "email": "joao@example.com",
    "createdAt": "2026-02-18T..."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. **Login**

```http
POST /login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta (200 OK):**

```json
{
  "message": "Login realizado com sucesso!",
  "user": {
    "_id": "...",
    "name": "João Silva",
    "email": "joao@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Resposta com IP desconhecido (403):**

```json
{
  "warning": "Detectamos tentativa de acesso de um local diferente do normal."
}
```

**Resposta com conta bloqueada (403):**

```json
{
  "error": "Conta bloqueado temporariamente por excesso de tentativas"
}
```

### 3. **Acessar Dados Protegidos**

```http
GET /me
Authorization: Bearer <seu_token_jwt>
```

**Resposta (200 OK):**

```json
{
  "message": "Seja bem vindo 64a1f2b3c4d5e6f7g8h9i0j1"
}
```

**Resposta sem token (401):**

```json
{
  "error": "Token nao fornecido pelo auth header."
}
```

## 📊 Schema do Usuário

```javascript
{
  name: String,                    // Nome do usuário
  email: String,                   // Email único (lowercase)
  password: String,                // Senha hasheada (select: false)
  lastIp: String,                  // Último IP de acesso
  createdAt: Date,                 // Data de criação
  loginAttempts: Number,           // Contador de tentativas (padrão: 0)
  lockUntil: Date,                 // Data até quando a conta está bloqueada
  knowIps: [String]                // Array de IPs conhecidos
}
```

## 📚 Fluxo de Autenticação

```
1. REGISTRO
   └─ Valida se email já existe
   └─ Captura IP do cliente
   └─ Faz hash da senha
   └─ Cria usuário e token

2. LOGIN
   ├─ Procura usuário pelo email
   ├─ Verifica se conta está bloqueada
   ├─ Valida senha
   ├─ Verifica se IP é conhecido
   ├─ Se tudo OK: reseta tentativas e autoriza
   └─ Se falha: incrementa tentativas e bloqueia se necessário

3. ACESSO A ROTAS PROTEGIDAS
   ├─ Middleware valida token JWT
   ├─ Extrai ID do usuário
   └─ Permite acesso à rota
```

## 🔐 Segurança: Pontos-Chave

### ❌ **Problemas Evitados**

- Senhas em texto plano
- SQL Injection (usando Mongoose)
- Força bruta sem limite
- Acesso a rota protegida sem token
- Tokens sem expiração

### ✅ **Implementações de Segurança**

- Hashing de senhas com salt
- Validação de email único
- Bloqueio de conta após múltiplas falhas
- Monitoramento de IPs
- Tokens JWT com expiração
- Middleware de autenticação obrigatório

## 🎯 Possíveis Melhorias Futuras

- [ ] **Reescrever projeto em TypeScript** - Implementar o mesmo projeto com tipagem completa para maior controle, segurança de tipo e melhor experiência de desenvolvimento
- [ ] Implementar refresh tokens
- [ ] Adicionar autenticação por email (verificação)
- [ ] Implementar 2FA (Two-Factor Authentication)
- [ ] Adicionar rate limiting por IP
- [ ] Implementar logout (blacklist de tokens)
- [ ] Adicionar logs de atividade
- [ ] Implementar reset de senha por email
- [ ] Adicionar validação de força de senha
- [ ] Implementar OAuth (Google, GitHub, etc.)

## 📖 Como Testar

### Usando Postman:

1. Importe as rotas como exemplos acima
2. Copie o token da resposta de login
3. Use em _Authorization_ > _Bearer Token_

**Desenvolvido para fins de aprendizado**
