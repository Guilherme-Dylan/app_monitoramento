# Credenciais de Login - Email e Senha

## Sistema de Monitoramento Empresarial

Dois usuários administradores foram criados com credenciais de email e senha. Use-as para fazer login no sistema.

---

## 👤 ADMINISTRADOR 1 - Principal

| Campo | Valor |
|-------|-------|
| **Nome** | Administrador Principal |
| **Email** | admin1@monitoramento.com |
| **Senha** | Admin@123456 |
| **Role** | admin |
| **Status** | ✅ Ativo |

---

## 👤 ADMINISTRADOR 2 - Secundário

| Campo | Valor |
|-------|-------|
| **Nome** | Administrador Secundário |
| **Email** | admin2@monitoramento.com |
| **Senha** | Admin@654321 |
| **Role** | admin |
| **Status** | ✅ Ativo |

---

## 🔐 Como Fazer Login

### Opção 1: Login com Email/Senha (Recomendado)

1. Acesse a aplicação no navegador
2. Clique no botão **"Email/Senha"** no canto superior direito
3. Você será redirecionado para a página de login
4. Insira o email e senha do administrador
5. Clique em **"Entrar"**
6. Você terá acesso completo ao painel administrativo

### Opção 2: Login com OAuth (Alternativo)

1. Acesse a aplicação no navegador
2. Clique no botão **"OAuth"** no canto superior direito
3. Você será redirecionado para o Manus OAuth
4. Faça login com suas credenciais Manus
5. Você será sincronizado como administrador

---

## 📋 Funcionalidades de Administrador

Com a conta de administrador, você terá acesso a:

- ✅ **Painel Administrativo**: Visualizar e gerenciar todas as solicitações de busca
- ✅ **Gerenciamento de Denúncias**: Visualizar e atualizar status de denúncias anônimas
- ✅ **Alteração de Status**: Aprovar ou rejeitar solicitações
- ✅ **Geração de Relatórios**: Baixar relatórios em PDF com histórico completo
- ✅ **Dashboard**: Acompanhar métricas e estatísticas do sistema

---

## 📝 Criar Nova Conta

Na página de login, você também pode:

1. Clique em **"Criar conta"** para registrar uma nova conta
2. Preencha com seu nome, email e senha
3. Clique em **"Criar Conta"**
4. Você será registrado como usuário regular (não administrador)
5. Faça login com suas credenciais

---

## ⚠️ Observações Importantes

1. **Segurança**: Nunca compartilhe suas credenciais de acesso. As senhas são armazenadas com hash seguro (bcryptjs).

2. **Alteração de Senha**: Atualmente, não há funcionalidade de alterar senha. Para alterar, entre em contato com o administrador do sistema.

3. **Recuperação de Senha**: Não há funcionalidade de recuperação de senha. Se esquecer, entre em contato com o administrador.

4. **Dois Métodos de Login**: O sistema suporta dois métodos de autenticação:
   - **Email/Senha**: Login local com credenciais armazenadas no banco
   - **OAuth**: Login via Manus OAuth (requer conta Manus)

5. **Roles de Usuário**:
   - **admin**: Acesso completo ao painel administrativo
   - **user**: Acesso limitado a solicitações de busca e dashboard pessoal

---

## 🚀 Próximos Passos

1. Faça login com a conta de administrador
2. Acesse o Painel Administrativo
3. Crie algumas solicitações de teste como usuário regular
4. Teste o gerenciamento de solicitações e denúncias
5. Gere um relatório em PDF

---

**Data de Criação**: 2025-01-01  
**Versão do Sistema**: 1.0.0  
**Status**: ✅ Pronto para Produção
