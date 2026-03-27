# 🚀 Guia Completo: Deploy Vercel + PlanetScale

Este guia mostra como migrar seu app de Monitoramento do Manus para Vercel com banco de dados MySQL no PlanetScale.

---

## 📋 Pré-requisitos

- ✅ Conta GitHub (você já tem)
- ✅ Repositório GitHub com seu código
- ⬜ Conta Vercel (vamos criar)
- ⬜ Conta PlanetScale (vamos criar)

---

## 🔧 PASSO 1: Criar Conta PlanetScale

### 1.1 Acessar PlanetScale
1. Acesse [https://planetscale.com](https://planetscale.com)
2. Clique em **"Sign up"**
3. Escolha **"Sign up with GitHub"** (mais fácil)
4. Autorize a conexão com GitHub

### 1.2 Criar Banco de Dados
1. Clique em **"Create a new database"**
2. Nome: `monitoramento_app`
3. Região: Escolha a mais próxima de você (ex: `us-east`)
4. Clique em **"Create database"**

### 1.3 Aguardar Criação
- Aguarde 1-2 minutos enquanto o banco é criado
- Você verá uma tela com as credenciais

---

## 📊 PASSO 2: Obter Credenciais do PlanetScale

### 2.1 Conectar com MySQL Workbench
1. Na tela do PlanetScale, clique em **"Connect"**
2. Selecione **"MySQL Workbench"**
3. Clique em **"Create password"** (se não tiver)
4. Copie a senha gerada (salve em local seguro!)

### 2.2 Obter DATABASE_URL
1. Clique em **"Connect"** novamente
2. Selecione **"Node.js"**
3. Copie a string de conexão (DATABASE_URL)
   - Exemplo: `mysql://user:password@host/database`

### 2.3 Testar Conexão no MySQL Workbench
1. Abra MySQL Workbench
2. Clique em **"+"** para nova conexão
3. Preencha com os dados do PlanetScale:
   - **Hostname**: (do PlanetScale)
   - **Username**: (do PlanetScale)
   - **Password**: (que você criou)
4. Clique em **"Test Connection"**
5. Se funcionar, clique em **"OK"**

---

## 🗄️ PASSO 3: Migrar Dados do MySQL Local para PlanetScale

### 3.1 Exportar Dados do MySQL Local
1. No MySQL Workbench, conecte ao seu banco local
2. Clique com botão direito no banco `monitoramento_app`
3. Selecione **"Export as SQL Dump"**
4. Salve como `backup.sql`

### 3.2 Importar para PlanetScale
1. No MySQL Workbench, conecte ao PlanetScale
2. Clique em **"File"** → **"Open SQL Script"**
3. Selecione o arquivo `backup.sql`
4. Clique em **"Execute"** (ícone de raio)
5. Aguarde a importação terminar

### 3.3 Verificar Dados
1. No PlanetScale (MySQL Workbench), expanda o banco
2. Verifique se as tabelas aparecem:
   - `users`
   - `requests`
   - `visits`
   - `anonymous_reports`

---

## 🌐 PASSO 4: Criar Conta Vercel

### 4.1 Acessar Vercel
1. Acesse [https://vercel.com](https://vercel.com)
2. Clique em **"Sign up"**
3. Escolha **"Continue with GitHub"**
4. Autorize a conexão

### 4.2 Importar Projeto
1. Após fazer login, clique em **"Add New"** → **"Project"**
2. Clique em **"Import Git Repository"**
3. Procure por `Guilherme-Dylan/app_monitoramento`
4. Clique em **"Import"**

---

## ⚙️ PASSO 5: Configurar Variáveis de Ambiente na Vercel

### 5.1 Acessar Configurações
1. Na página do projeto Vercel, clique em **"Settings"**
2. Clique em **"Environment Variables"** (no menu esquerdo)

### 5.2 Adicionar Variáveis
Clique em **"Add New"** e preencha cada uma:

| Nome | Valor |
|------|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Sua string do PlanetScale (mysql://...) |
| `JWT_SECRET` | Gere uma chave aleatória (use um gerador online) |
| `VITE_APP_ID` | `sk-zSYVhtrBDRXqlTu576SieZw4r3EbLaHa9InY6gvkzw_NmxFb0rWdLn7iROCOKFcK90FXG--rDNXnXazLlzCtWvhUVwg7` |
| `OAUTH_SERVER_URL` | `https://api.manus.im` |
| `VITE_OAUTH_PORTAL_URL` | `https://manus.im` |
| `BUILT_IN_FORGE_API_URL` | `https://api.manus.im` |
| `BUILT_IN_FORGE_API_KEY` | `sk-zSYVhtrBDRXqlTu576SieZw4r3EbLaHa9InY6gvkzw_NmxFb0rWdLn7iROCOKFcK90FXG--rDNXnXazLlzCtWvhUVwg7` |
| `VITE_FRONTEND_FORGE_API_KEY` | `sk-zSYVhtrBDRXqlTu576SieZw4r3EbLaHa9InY6gvkzw_NmxFb0rWdLn7iROCOKFcK90FXG--rDNXnXazLlzCtWvhUVwg7` |
| `VITE_FRONTEND_FORGE_API_URL` | `https://api.manus.im` |
| `VITE_APP_TITLE` | `Monitoramento App` |
| `VITE_APP_LOGO` | `/logo.svg` |
| `OWNER_NAME` | `Dylan` |
| `OWNER_OPEN_ID` | Seu ID Manus (pode deixar em branco) |

### 5.3 Salvar Variáveis
- Clique em **"Save"** após adicionar cada uma
- Verifique se todas aparecem na lista

---

## 🚀 PASSO 6: Fazer Deploy

### 6.1 Iniciar Deploy
1. Volte para a página principal do projeto
2. Clique em **"Deployments"** (no topo)
3. Você verá um deploy em progresso
4. Aguarde até aparecer ✅ (verde)

### 6.2 Acessar App
1. Clique no deploy verde
2. Clique em **"Visit"** ou copie a URL
3. Seu app estará disponível em: `https://seu-projeto.vercel.app`

---

## ✅ PASSO 7: Testar Funcionalidades

### 7.1 Testar Login
1. Acesse a URL do seu app
2. Clique em **"Login"**
3. Faça login com sua conta Manus
4. Verifique se aparece o painel administrativo

### 7.2 Testar Denúncia Anônima
1. Volte para Home
2. Clique em **"Fazer Denúncia"**
3. Preencha o formulário
4. Clique em **"Enviar"**
5. Verifique se a denúncia aparece no painel admin

### 7.3 Testar Solicitação de Busca
1. Faça login
2. Clique em **"Nova Solicitação"**
3. Preencha os dados
4. Clique em **"Enviar"**
5. Verifique se aparece no painel admin

### 7.4 Testar Geração de PDF
1. No painel admin, clique em **"Gerar PDF"**
2. Verifique se o arquivo baixa corretamente

---

## 🔄 PASSO 8: Configurar Deploy Automático

### 8.1 Deploy Automático (Já Configurado!)
- Sempre que você fizer um `git push` no GitHub, a Vercel fará deploy automaticamente
- Você verá o progresso em **"Deployments"**

### 8.2 Verificar Status
1. Acesse seu repositório GitHub
2. Clique em **"Actions"**
3. Você verá os deploys automáticos

---

## 🆘 Troubleshooting

### Erro: "Database connection failed"
- ✅ Verifique se `DATABASE_URL` está correto
- ✅ Verifique se o PlanetScale está ativo
- ✅ Verifique se a senha do PlanetScale está correta

### Erro: "Cannot find module"
- ✅ Execute `pnpm install` localmente
- ✅ Faça um `git push` para atualizar GitHub
- ✅ A Vercel fará novo deploy automaticamente

### App carrega mas não conecta ao banco
- ✅ Verifique as variáveis de ambiente em Settings → Environment Variables
- ✅ Clique em **"Redeploy"** para aplicar mudanças

### Redeploy Manual
1. Na página do projeto Vercel
2. Clique em **"Deployments"**
3. Clique nos 3 pontinhos (...) do último deploy
4. Selecione **"Redeploy"**

---

## 📞 Próximos Passos

1. ✅ Criar conta PlanetScale
2. ✅ Migrar dados do MySQL local
3. ✅ Criar conta Vercel
4. ✅ Configurar variáveis de ambiente
5. ✅ Fazer deploy
6. ✅ Testar funcionalidades
7. ✅ Configurar domínio customizado (opcional)

---

## 🎉 Pronto!

Seu app está agora hospedado na Vercel com banco de dados MySQL no PlanetScale!

**URL do seu app:** `https://seu-projeto.vercel.app`

Qualquer dúvida, é só chamar! 🚀
