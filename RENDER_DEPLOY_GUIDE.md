# 🚀 Guia de Deploy no Render

## O que é Render?

Render é uma plataforma de hospedagem moderna que oferece:
- ✅ Plano gratuito com Node.js + PostgreSQL
- ✅ Deploy automático do GitHub
- ✅ SSL/HTTPS incluído
- ✅ Banco de dados PostgreSQL gratuito
- ✅ Sem cartão de crédito necessário

## 📋 Pré-requisitos

1. ✅ Conta criada no Render (https://render.com)
2. ✅ Repositório GitHub conectado
3. ✅ Arquivos de configuração criados (`render.yaml` e `Procfile`)

## 🎯 Passo a Passo para Deploy

### Passo 1: Conectar GitHub ao Render

1. Acesse: https://dashboard.render.com
2. Clique em **"New +"** → **"Web Service"**
3. Clique em **"Connect a repository"**
4. Selecione **"Guilherme-Dylan/app_monitoramento"**
5. Clique em **"Connect"**

### Passo 2: Configurar o Serviço Web

1. **Name**: `monitoramento-app`
2. **Environment**: `Node`
3. **Build Command**: `pnpm install --no-frozen-lockfile && pnpm build`
4. **Start Command**: `pnpm start`
5. **Plan**: Selecione **"Free"**

### Passo 3: Adicionar Banco de Dados PostgreSQL

1. Clique em **"New +"** → **"PostgreSQL"**
2. **Name**: `monitoramento-db`
3. **Database**: `monitoramento`
4. **User**: `monitoramento_user`
5. **Plan**: Selecione **"Free"**
6. Clique em **"Create Database"**

### Passo 4: Configurar Variáveis de Ambiente

1. Volte para seu Web Service
2. Vá em **"Environment"**
3. Adicione as seguintes variáveis:

```
NODE_ENV=production
DATABASE_URL=<será preenchido automaticamente pelo PostgreSQL>
JWT_SECRET=<gere uma chave aleatória>
VITE_APP_ID=<sua chave do Manus>
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im
OWNER_OPEN_ID=<seu ID do Manus>
OWNER_NAME=<seu nome>
BUILT_IN_FORGE_API_URL=<URL da API Manus>
BUILT_IN_FORGE_API_KEY=<sua chave da API Manus>
VITE_FRONTEND_FORGE_API_KEY=<chave frontend Manus>
VITE_FRONTEND_FORGE_API_URL=<URL frontend Manus>
VITE_APP_TITLE=Monitoramento App
VITE_APP_LOGO=/logo.svg
```

### Passo 5: Deploy

1. Clique em **"Deploy"**
2. Aguarde 5-10 minutos
3. Seu app estará disponível em: `https://monitoramento-app.onrender.com`

## 📊 O Que Acontece Durante o Deploy

1. ✅ Render clona seu repositório GitHub
2. ✅ Instala dependências (`pnpm install`)
3. ✅ Faz build do projeto (`pnpm build`)
4. ✅ Inicia o servidor (`pnpm start`)
5. ✅ Configura SSL/HTTPS automaticamente

## ⏱️ Tempo de Deploy

- **Primeira vez**: 10-15 minutos
- **Próximas vezes**: 3-5 minutos

## 🔄 Deploy Automático

Após configurar, **qualquer commit no GitHub** dispara um novo deploy automaticamente!

## 🐛 Troubleshooting

### Erro: "Build failed"
- Verifique se todas as dependências estão instaladas
- Execute `pnpm install` localmente e verifique se há erros
- Confira o `package.json` e `pnpm-lock.yaml`

### Erro: "Database connection failed"
- Verifique se a variável `DATABASE_URL` está configurada
- Certifique-se de que o banco de dados foi criado
- Teste a conexão localmente

### App não inicia
- Verifique os logs em **"Logs"** no dashboard do Render
- Confira se todas as variáveis de ambiente estão configuradas
- Teste o comando `pnpm start` localmente

## 📝 Dicas Importantes

1. **Primeira inicialização**: O banco de dados pode levar alguns minutos para estar pronto
2. **Plano gratuito**: App pode demorar para iniciar se ficar inativo por muito tempo
3. **Logs**: Sempre verifique os logs para debug
4. **Backup**: Configure backups do banco de dados regularmente

## 🎉 Sucesso!

Seu app está hospedado no Render! Você pode:
- ✅ Acessar em: `https://monitoramento-app.onrender.com`
- ✅ Fazer deploy automático ao fazer push no GitHub
- ✅ Monitorar logs em tempo real
- ✅ Escalar para plano pago quando necessário

## 📞 Suporte

- Documentação Render: https://render.com/docs
- Status da plataforma: https://status.render.com
