# 📋 FlowTasks - Requisitos do Sistema - Checklist Completo

## 1️⃣ REQUISITOS FUNCIONAIS (RF)

### 🔐 Módulo de Autenticação

#### RF-001: Registro de Utilizador

- [x] O sistema deve permitir que novos utilizadores se registem com email, senha e nome
- [ ] O sistema deve validar formato de email
- [ ] O sistema deve exigir senha com mínimo 8 caracteres
- [ ] O sistema deve criptografar senhas usando bcrypt
- [x] O sistema deve impedir registro com emails duplicados
- [x] O sistema deve retornar token JWT após registro bem-sucedido

#### RF-002: Login de Utilizador

- [x] O sistema deve permitir login com email e senha
- [ ] O sistema deve validar credenciais contra a base de dados
- [x] O sistema deve retornar token JWT válido após login bem-sucedido
- [ ] O sistema deve armazenar token em HTTP-only cookie
- [ ] O sistema deve retornar erro 401 para credenciais inválidas

#### RF-003: Logout de Utilizador

- [ ] O sistema deve permitir que utilizadores autenticados façam logout
- [ ] O sistema deve invalidar/limpar token JWT
- [ ] O sistema deve limpar cookie de autenticação
- [ ] O sistema deve retornar confirmação de logout bem-sucedido

#### RF-004: Obter Dados do Utilizador Autenticado

- [ ] O sistema deve permitir que utilizadores autenticados obtenham seus dados
- [ ] O sistema deve retornar id, email, nome e tema do utilizador
- [ ] O sistema deve excluir senha do retorno
- [ ] O sistema deve validar token JWT antes de retornar dados

#### RF-005: Atualizar Tema do Utilizador

- [ ] O sistema deve permitir alternar entre tema 'light' e 'dark'
- [ ] O sistema deve validar que tema é 'light' ou 'dark'
- [ ] O sistema deve persistir preferência de tema na base de dados
- [ ] O sistema deve retornar tema atualizado

---

### ✅ Módulo de Gestão de Tarefas (Todos)

#### RF-006: Listar Todos do Utilizador

- [x] O sistema deve retornar todos os todos do utilizador autenticado
- [x] O sistema deve ordenar todos por `order` ascendente
- [x] O sistema deve permitir filtrar por status: `'all'`, `'active'`, `'completed'`
- [x] O sistema deve incluir todos os campos: `id`, `title`, `completedAt`, `order`, timestamps
- [x] O sistema deve retornar array vazio se utilizador não tiver todos

#### RF-007: Criar Novo Todo

- [x] O sistema deve permitir criar novo todo
- [x] O sistema deve associar todo ao utilizador autenticado
- [x] O sistema deve definir `completedAt` como nulo por padrão
- [x] O sistema deve calcular próxima posição automaticamente (`maxOrder + 1`)
- [ ] O sistema deve validar que `title` não está vazio
- [ ] O sistema deve validar que `title` tem máximo 500 caracteres
- [x] O sistema deve retornar todo criado com id gerado
- [x] O sistema deve definir timestamps (`createdAt`, `updatedAt`)

#### RF-008: Actualizar Todo

- [x] O sistema deve permitir actualizar `title` do todo
- [x] O sistema deve permitir actualizar `order` do todo
- [x] O sistema deve permitir alternar `completedAt`
- [x] O sistema deve validar que todo pertence ao utilizador autenticado
- [ ] O sistema deve validar que `title` (se fornecido) não está vazio e tem máx 500 caracteres
- [x] O sistema deve actualizar timestamp `updatedAt` automaticamente
- [x] O sistema deve retornar todo actualizado
- [x] O sistema deve retornar erro se todo não existir

#### RF-009: Eliminar Todo

- [x] O sistema deve permitir eliminar todo por id
- [x] O sistema deve validar que todo pertence ao utilizador autenticado
- [x] O sistema deve remover todo permanentemente da base de dados
- [x] O sistema deve retornar confirmação de eliminação
- [x] O sistema deve retornar erro se todo não existir

#### RF-010: Reordenar Múltiplos Todos

- [x] O sistema deve permitir reordenar múltiplos todos numa única operação
- [x] O sistema deve receber array de objectos com `{id, order}`
- [x] O sistema deve validar que todos os ids pertencem ao utilizador autenticado
- [ ] O sistema deve actualizar `order` em transação (tudo ou nada)
- [ ] O sistema deve retornar confirmação de sucesso
- [ ] O sistema deve reverter mudanças se houver erro

#### RF-011: Limpar Todos Completos

- [x] O sistema deve permitir eliminar todos os todos com `completedAt` definidos
- [x] O sistema deve eliminar apenas todos do utilizador autenticado
- [ ] O sistema deve executar em transação
- [ ] O sistema deve reajustar `order` dos todos restantes

#### RF-012: Contar Todos

- [x] O sistema deve retornar contagem total de todos
- [x] O sistema deve retornar contagem de todos ativos
- [x] O sistema deve retornar contagem de todos completos
- [x] O sistema deve calcular contagens apenas para utilizador autenticado

---

## 2️⃣ REGRAS DE NEGÓCIO (RN)

### 🔐 Regras de Autenticação

#### RN-001: Validação de Email

- [ ] Email deve ter formato válido (conter @ e domínio)
- [ ] Email deve ser único no sistema
- [ ] Email deve ser convertido para lowercase antes de salvar
- [ ] Email não pode conter espaços

#### RN-002: Validação de Senha

- [ ] Senha deve ter mínimo 8 caracteres
- [ ] Senha deve conter pelo menos 1 letra maiúscula
- [ ] Senha deve conter pelo menos 1 letra minúscula
- [ ] Senha deve conter pelo menos 1 número
- [ ] Senha deve ser hasheada com bcrypt (salt rounds: 10)
- [ ] Senha nunca deve ser retornada em responses

#### RN-003: Token JWT

- [ ] Token deve expirar em 7 dias
- [ ] Token deve conter userId e email no payload
- [ ] Token deve ser assinado com secret seguro
- [ ] Token deve ser armazenado em HTTP-only cookie
- [ ] Cookie deve ter flag 'secure' em produção (HTTPS)
- [ ] Cookie deve ter flag 'sameSite: strict'

#### RN-004: Sessões

- [ ] Utilizador só pode ter uma sessão ativa por vez (opcional)
- [ ] Logout deve invalidar token imediatamente
- [ ] Token expirado deve retornar erro 401

---

### ✅ Regras de Gestão de Todos

#### RN-005: Criação de Todos

- [ ] Todo deve sempre ter utilizador associado (`userId`)
- [ ] `title` é obrigatório e não pode ser vazio
- [ ] `title` deve ter máximo 500 caracteres
- [ ] `title` deve ter espaços em branco removidos (trim)
- [x] `completedAt` é nulo por padrão
- [x] `order` é calculada automaticamente (`max(order) + 1`)
- [x] Timestamps são gerados automaticamente

#### RN-006: Edição de Todos

- [x] Utilizador só pode editar seus próprios todos
- [x] `completedAt` pode ser alternado entre Date/Nulo
- [ ] `title`, se atualizado, deve seguir mesmas regras de criação
- [x] `order` pode ser actualizada para reordenação
- [x] `updatedAt` deve ser atualizado automaticamente

#### RN-007: Eliminação de Todos

- [x] Utilizador só pode eliminar seus próprios todos
- [x] Eliminação é permanente (sem soft delete)
- [ ] Eliminar utilizador deve eliminar todos seus todos (CASCADE)

#### RN-008: Reordenação

- [] `order` deve ser número inteiro não-negativo
- [x] Não pode haver dois todos com mesma `order` para mesmo utilizador
- [ ] Reordenação deve ser atômica (transação)
- [ ] Se reordenação falhar, nenhuma mudança deve persistir

#### RN-009: Filtragem

- [x] Filtro `'all'` retorna todos os todos
- [x] Filtro `'active'` retorna apenas todos nao completados
- [x] Filtro `'completed'` retorna apenas todos completados
- [x] Filtro inválido deve retornar erro 422

#### RN-010: Privacidade de Dados

- [x] Utilizador nunca pode ver todos de outros utilizadores
- [x] Todas as operações de leitura devem filtrar por `userId`
- [ ] Todas as operações de escrita devem validar propriedade

---

## 3️⃣ REQUISITOS NÃO-FUNCIONAIS (RNF)

### 🔒 Segurança

#### RNF-001: Autenticação e Autorização

- [ ] Todas as rotas de todos devem exigir autenticação
- [ ] Token JWT deve ser validado em cada request
- [ ] Senhas devem usar bcrypt com mínimo 10 salt rounds
- [ ] Tokens devem ter tempo de expiração configurável
- [ ] Sistema deve impedir SQL Injection usando prepared statements
- [ ] Sistema deve sanitizar inputs para prevenir XSS

#### RNF-002: Rate Limiting

- [ ] Endpoints de autenticação: máximo 5 requests por 15 minutos
- [ ] Endpoints de API: máximo 100 requests por 15 minutos
- [ ] Rate limit deve ser por IP
- [ ] Erro 429 deve ser retornado quando limite excedido

#### RNF-003: CORS

- [ ] CORS deve permitir apenas origem do frontend (whitelist)
- [ ] Credentials devem ser permitidos (cookies)
- [ ] Apenas métodos necessários devem ser permitidos

#### RNF-004: Headers de Segurança

- [ ] Helmet.js deve ser configurado
- [ ] CSP (Content Security Policy) deve estar ativo
- [ ] HSTS deve estar ativo em produção
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff

---

### ⚡ Performance

#### RNF-005: Tempo de Resposta

- [ ] Endpoints de leitura devem responder em < 200ms (p95)
- [ ] Endpoints de escrita devem responder em < 500ms (p95)
- [ ] Login deve responder em < 1s (p95)

#### RNF-006: Base de Dados

- [ ] Índices devem existir em colunas frequentemente consultadas
- [ ] Queries devem usar prepared statements
- [ ] Connection pool deve ter mínimo 5 e máximo 20 conexões
- [ ] Queries complexas devem usar EXPLAIN para otimização

#### RNF-007: Caching (Opcional)

- [ ] Dados de utilizador podem ser cacheados por 5 minutos
- [ ] Lista de todos pode ser cacheada por 30 segundos
- [ ] Cache deve ser invalidado após mutações

---

### 🔄 Escalabilidade

#### RNF-008: Arquitetura

- [ ] Backend deve ser stateless (sem sessões em memória)
- [ ] Sistema deve suportar múltiplas instâncias (horizontal scaling)
- [ ] Base de dados deve ter backup automático diário
- [ ] Sistema deve suportar mínimo 1000 utilizadores simultâneos

#### RNF-009: Limites de Recursos

- [ ] Utilizador pode ter máximo 1000 todos
- [ ] Requests devem ter timeout de 30 segundos
- [ ] Upload de dados deve ter limite de 1MB por request

---

### 📊 Observabilidade

#### RNF-010: Logging

- [ ] Todos os erros devem ser logados
- [ ] Requests devem ser logados (método, rota, status, tempo)
- [ ] Logs devem incluir timestamp e nível (info, warn, error)
- [ ] Logs sensíveis (senhas, tokens) nunca devem ser logados
- [ ] Logs devem ser estruturados (JSON)

#### RNF-011: Monitoring

- [ ] Sistema deve integrar com Sentry para error tracking
- [ ] Uptime deve ser monitorado (objetivo: 99.5%)
- [ ] Métricas de performance devem ser coletadas
- [ ] Alertas devem ser configurados para erros críticos

#### RNF-012: Health Checks

- [ ] Endpoint `/health` deve retornar status do servidor
- [ ] Endpoint `/health/db` deve verificar conexão com base de dados
- [ ] Health checks devem responder em `< 100ms`

---

### 🧪 Testabilidade

#### RNF-013: Testes

- [x] Código deve ter mínimo 70% de cobertura
- [x] Testes unitários devem cobrir lógica de negócio
- [ ] Testes de integração devem cobrir endpoints da API
- [x] Testes devem usar base de dados de teste isolada
- [ ] Testes devem ser executados em CI/CD

#### RNF-014: Documentação de API

- [ ] Todos os endpoints devem estar documentados
- [ ] Documentação deve incluir exemplos de request/response
- [ ] Schemas devem estar definidos
- [ ] Códigos de erro devem estar documentados

---

### 🌐 Usabilidade

#### RNF-015: API Design

- [ ] API deve seguir padrões RESTful
- [ ] Respostas devem ser consistentes (sempre JSON)
- [ ] Erros devem ter formato padronizado: {success, message, errors}
- [ ] Status codes HTTP devem ser apropriados:
  - [ ] 200: Sucesso
  - [ ] 201: Criado
  - [ ] 400: Bad Request
  - [ ] 401: Não autenticado
  - [ ] 403: Não autorizado
  - [ ] 404: Não encontrado
  - [ ] 429: Too Many Requests
  - [ ] 500: Erro interno

#### RNF-016: Mensagens de Erro

- [ ] Erros devem ser claros e descritivos
- [ ] Erros devem indicar campo problemático (validação)
- [ ] Erros não devem expor informações sensíveis em produção
- [ ] Erros devem ter i18n (inglês por padrão)

---

### 🚀 Deploy e DevOps

#### RNF-017: Ambiente

- [ ] Variáveis de ambiente devem ser usadas para configuração
- [ ] Secrets nunca devem estar no código
- [ ] Deve haver ambientes separados: dev, staging, production
- [ ] `.env.example` deve estar documentado

#### RNF-018: CI/CD

- [ ] Código deve passar por linting antes de merge
- [ ] Testes devem ser executados automaticamente
- [ ] Deploy deve ser automático após merge em main
- [ ] Rollback deve ser possível em caso de falha

#### RNF-019: Disponibilidade

- [ ] Sistema deve ter uptime de 99.5% (objetivo)
- [ ] Downtime planejado deve ser comunicado
- [ ] Sistema deve ter graceful shutdown
- [ ] Zero-downtime deployment (ideal)

---

## 📝 Formato de Resposta Padronizado da API

### Sucesso

```json
{
  "success": true,
  "data": {
    "results": [
      /* payload (s) */
    ]
  }
}
```

### Erro de Validação

```json
{
  "success": false,
  "data": {
    "error": {
      "email": {
        "errors": [
          "email must include @",
          "email must be a valid email address."
        ]
      },
      "password": {
        "errors": [
          "password must have at least 8 characters.",
          "password must have at least 1 uppercase.",
          "password must have at least 1 lowercase."
          "password must have at least 1 digit."
        ]
      }
    }
  }
}
```

### Erro normal

```json
{
  "success": false,
  "data": {
    "error": {
      "message": "Existing email."
    }
  }
}
```

---

## 🎯 Priorização de Implementação

### 🔴 MUST HAVE (P0) - Funcionalidades Essenciais

- RF-001 a RF-004 (Autenticação completa)
- RF-006 a RF-009 (CRUD de todos)
- RN-001 a RN-010 (Todas as regras de negócio core)
- RNF-001, RNF-015, RNF-017 (Segurança básica e API design)

### 🟡 SHOULD HAVE (P1) - Funcionalidades Importantes

- RF-010 (Reordenação)
- RF-011 (Limpar completos)
- RNF-005, RNF-006 (Performance)
- RNF-010 (Logging)
- RNF-013 (Testes)

### 🟢 COULD HAVE (P2) - Funcionalidades Boas de Ter

- RF-012 (Estatísticas)
- RNF-002 (Rate limiting avançado)
- RNF-007 (Caching)
- RNF-011 (Monitoring avançado)

### ⚪ WON'T HAVE (P3) - Futuras Melhorias

- WebSockets para real-time
- Categorias e prioridades
- Notificações
- Integrações externas

---

## 📚 Casos de Uso (Use Cases) para Testes

### UC-001: Registro de Utilizador

```txt
DADO que um novo utilizador acede à aplicação
QUANDO fornece email válido, senha forte e nome
ENTÃO conta é criada, token JWT é gerado e retornado
```

### UC-002: Login com Credenciais Válidas

```txt
DADO que um utilizador registado acede ao login
QUANDO fornece email e senha corretos
ENTÃO recebe token JWT e pode aceder à aplicação
```

### UC-003: Criar Todo

```txt
DADO que um utilizador está autenticado
QUANDO cria um novo todo com texto válido
ENTÃO todo é salvo, associado ao utilizador e retornado com ID
```

### UC-004: Marcar Todo como Completo

```txt
DADO que um utilizador tem um todo ativo
QUANDO marca como completo
ENTÃO status é atualizado para true e `updatedAt` é atualizado
```

### UC-005: Reordenar Todos por Drag & Drop

```txt
DADO que um utilizador tem múltiplos todos
QUANDO arrasta e solta um todo para nova posição
ENTÃO positions são atualizadas em transação atômica
```

---

Este checklist completo vai ajudá-lo a:

1. ✅ Implementar feature por feature de forma organizada
2. ✅ Criar testes unitários para cada requisito
3. ✅ Validar que todas as regras de negócio estão implementadas
4. ✅ Garantir qualidade e completude do projecto
5. ✅ Ter documentação clara para o README

Boa sorte com a implementação! 🚀
