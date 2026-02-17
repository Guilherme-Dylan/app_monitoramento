# Guia: Inserir Usuários e Admins via MySQL Workbench

Este guia mostra como inserir usuários (regulares e administradores) no banco de dados usando MySQL Workbench.

## 📋 Estrutura da Tabela `users`

| Campo | Tipo | Descrição | Obrigatório |
|-------|------|-----------|------------|
| `id` | INT | ID único (auto-incrementado) | ✅ Automático |
| `email` | VARCHAR(320) | Email do usuário (único) | ✅ Sim |
| `nome` | TEXT | Nome completo | ✅ Sim |
| `senha` | TEXT | Hash bcrypt da senha | ✅ Sim |
| `tipo_de_user` | ENUM | `user` ou `admin` | ✅ Sim (padrão: `user`) |
| `loginMethod` | VARCHAR(64) | Método de login (`local` ou `oauth`) | ✅ Sim |
| `openId` | VARCHAR(64) | ID do OAuth (NULL para login local) | ❌ Opcional |
| `createdAt` | TIMESTAMP | Data de criação | ✅ Automático |
| `updatedAt` | TIMESTAMP | Data de atualização | ✅ Automático |
| `lastSignedIn` | TIMESTAMP | Último login | ✅ Automático |

---

## 🔐 Gerando Hash de Senha (bcrypt)

Antes de inserir um usuário, você precisa gerar o hash bcrypt da senha. Use uma dessas opções:

### Opção 1: Online (rápido)
1. Acesse: https://bcrypt.online/
2. Digite a senha desejada
3. Copie o hash gerado

### Opção 2: Node.js (recomendado)
```bash
node -e "
const bcryptjs = require('bcryptjs');
const password = 'SuaSenha123';
bcryptjs.hash(password, 10).then(hash => console.log(hash));
"
```

### Opção 3: Python
```python
import bcrypt
password = 'SuaSenha123'
hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt(10))
print(hash.decode())
```

**Exemplo de hash gerado:**
```
$2b$10$xIVoFfoKeXmv9CLB4saiDO/MvncTveSXtl6oYuFfwfvOljMhFidze
```

---

## 📝 Inserindo Usuários via Workbench

### Passo 1: Abrir MySQL Workbench
1. Abra o **MySQL Workbench**
2. Conecte-se ao seu banco de dados
3. Clique na aba **SQL Editor** ou **Query**

### Passo 2: Copiar e Executar Script SQL

Escolha um dos scripts abaixo conforme seu caso:

---

## 🟢 Script 1: Inserir Usuário Regular

```sql
INSERT INTO users (email, nome, senha, tipo_de_user, loginMethod, createdAt, updatedAt, lastSignedIn)
VALUES (
  'usuario@example.com',
  'João Silva',
  '$2b$10$xIVoFfoKeXmv9CLB4saiDO/MvncTveSXtl6oYuFfwfvOljMhFidze',
  'user',
  'local',
  NOW(),
  NOW(),
  NOW()
);
```

**Substitua:**
- `usuario@example.com` → Email do usuário
- `João Silva` → Nome completo
- `$2b$10$...` → Hash bcrypt da senha

---

## 🔴 Script 2: Inserir Administrador

```sql
INSERT INTO users (email, nome, senha, tipo_de_user, loginMethod, createdAt, updatedAt, lastSignedIn)
VALUES (
  'admin@example.com',
  'Admin Sistema',
  '$2b$10$xIVoFfoKeXmv9CLB4saiDO/MvncTveSXtl6oYuFfwfvOljMhFidze',
  'admin',
  'local',
  NOW(),
  NOW(),
  NOW()
);
```

---

## 📦 Script 3: Inserir Múltiplos Usuários de Uma Vez

```sql
INSERT INTO users (email, nome, senha, tipo_de_user, loginMethod, createdAt, updatedAt, lastSignedIn)
VALUES 
  ('joao@example.com', 'João Silva', '$2b$10$xIVoFfoKeXmv9CLB4saiDO/MvncTveSXtl6oYuFfwfvOljMhFidze', 'user', 'local', NOW(), NOW(), NOW()),
  ('maria@example.com', 'Maria Santos', '$2b$10$xIVoFfoKeXmv9CLB4saiDO/MvncTveSXtl6oYuFfwfvOljMhFidze', 'user', 'local', NOW(), NOW(), NOW()),
  ('admin1@example.com', 'Admin Um', '$2b$10$xIVoFfoKeXmv9CLB4saiDO/MvncTveSXtl6oYuFfwfvOljMhFidze', 'admin', 'local', NOW(), NOW(), NOW()),
  ('admin2@example.com', 'Admin Dois', '$2b$10$xIVoFfoKeXmv9CLB4saiDO/MvncTveSXtl6oYuFfwfvOljMhFidze', 'admin', 'local', NOW(), NOW(), NOW());
```

---

## ✅ Verificar Usuários Inseridos

Após inserir, execute este script para verificar:

```sql
SELECT id, email, nome, tipo_de_user, loginMethod, createdAt FROM users ORDER BY id DESC;
```

**Resultado esperado:**
```
| id  | email                | nome          | tipo_de_user | loginMethod | createdAt           |
|-----|----------------------|---------------|--------------|-------------|---------------------|
| 5   | admin2@example.com   | Admin Dois    | admin        | local       | 2026-02-17 10:30:00 |
| 4   | admin1@example.com   | Admin Um      | admin        | local       | 2026-02-17 10:30:00 |
| 3   | maria@example.com    | Maria Santos  | user         | local       | 2026-02-17 10:30:00 |
| 2   | joao@example.com     | João Silva    | user         | local       | 2026-02-17 10:30:00 |
```

---

## 🔄 Atualizar Tipo de Usuário (user ↔ admin)

Se você quer mudar um usuário regular para admin:

```sql
UPDATE users SET tipo_de_user = 'admin' WHERE email = 'joao@example.com';
```

Para mudar um admin para usuário regular:

```sql
UPDATE users SET tipo_de_user = 'user' WHERE email = 'admin1@example.com';
```

---

## 🔑 Alterar Senha de um Usuário

Se você quer alterar a senha de um usuário existente:

```sql
UPDATE users 
SET senha = '$2b$10$NOVO_HASH_BCRYPT_AQUI'
WHERE email = 'joao@example.com';
```

---

## ⚠️ Cuidados Importantes

1. **Email Único**: Cada email deve ser único. Se tentar inserir um email duplicado, receberá erro.
2. **Hash Bcrypt Obrigatório**: Nunca insira senhas em texto plano! Sempre use hash bcrypt.
3. **Tipo de User**: Deve ser `user` ou `admin` (case-sensitive).
4. **loginMethod**: Para login local, use `local`. Para OAuth, use `oauth`.

---

## 🚀 Exemplo Completo: Criar 2 Admins e 3 Usuários

```sql
-- Inserir 2 administradores
INSERT INTO users (email, nome, senha, tipo_de_user, loginMethod, createdAt, updatedAt, lastSignedIn)
VALUES 
  ('admin.carlos@empresa.com', 'Carlos Admin', '$2b$10$xIVoFfoKeXmv9CLB4saiDO/MvncTveSXtl6oYuFfwfvOljMhFidze', 'admin', 'local', NOW(), NOW(), NOW()),
  ('admin.ana@empresa.com', 'Ana Admin', '$2b$10$xIVoFfoKeXmv9CLB4saiDO/MvncTveSXtl6oYuFfwfvOljMhFidze', 'admin', 'local', NOW(), NOW(), NOW());

-- Inserir 3 usuários regulares
INSERT INTO users (email, nome, senha, tipo_de_user, loginMethod, createdAt, updatedAt, lastSignedIn)
VALUES 
  ('joao.silva@empresa.com', 'João Silva', '$2b$10$xIVoFfoKeXmv9CLB4saiDO/MvncTveSXtl6oYuFfwfvOljMhFidze', 'user', 'local', NOW(), NOW(), NOW()),
  ('maria.santos@empresa.com', 'Maria Santos', '$2b$10$xIVoFfoKeXmv9CLB4saiDO/MvncTveSXtl6oYuFfwfvOljMhFidze', 'user', 'local', NOW(), NOW(), NOW()),
  ('pedro.oliveira@empresa.com', 'Pedro Oliveira', '$2b$10$xIVoFfoKeXmv9CLB4saiDO/MvncTveSXtl6oYuFfwfvOljMhFidze', 'user', 'local', NOW(), NOW(), NOW());

-- Verificar inserção
SELECT id, email, nome, tipo_de_user FROM users ORDER BY id DESC LIMIT 5;
```

---

## 📱 Testando Login

Após inserir um usuário, você pode fazer login no site com:
- **Email**: `joao.silva@empresa.com`
- **Senha**: `SuaSenha123` (a senha que você hasheou)

---

## ❓ Dúvidas Frequentes

**P: Posso inserir usuários sem senha?**
R: Não, a senha é obrigatória. Sempre use um hash bcrypt válido.

**P: Como saber qual hash corresponde a qual senha?**
R: Você não consegue "deshasheá-lo". Mantenha um registro seguro das senhas originais.

**P: Posso usar a mesma senha para múltiplos usuários?**
R: Sim, você pode usar o mesmo hash bcrypt para vários usuários (não recomendado em produção).

**P: O que fazer se inserir um email errado?**
R: Use `DELETE FROM users WHERE email = 'email_errado@example.com';` para remover.

---

## 🔗 Recursos Úteis

- [bcrypt.online](https://bcrypt.online/) - Gerar hash bcrypt online
- [MySQL Workbench Docs](https://dev.mysql.com/doc/workbench/en/) - Documentação oficial
- [Bcrypt Explicado](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) - Segurança de senhas
