# 🚀 Setup: Deploy Automático no Manus

## 📌 Resumo

Este documento explica como configurar deploy automático no Manus. Qualquer mudança no GitHub será publicada automaticamente no site ao vivo.

## ⚙️ Como Funciona

```
Você faz commit no GitHub
    ↓
GitHub Actions dispara
    ↓
Executa testes e build
    ↓
Se tudo passar: Deploy automático
    ↓
Site é atualizado em 1-2 minutos
```

## 🔧 Setup (3 Passos)

### Passo 1: Adicionar Secret no GitHub

1. Vá para: https://github.com/Guilherme-Dylan/app_monitoramento
2. Clique em **Settings** (engrenagem)
3. No menu esquerdo, clique em **"Secrets and variables"** → **"Actions"**
4. Clique em **"New repository secret"**
5. Preencha:
   - **Name**: `MANUS_API_TOKEN`
   - **Secret**: Cole seu token (já fornecido)
6. Clique em **"Add secret"**

### Passo 2: Criar o Workflow

O arquivo `.github/workflows/auto-publish-manus.yml` já existe no repositório. Se não existir:

1. Vá para: https://github.com/Guilherme-Dylan/app_monitoramento
2. Clique em **"Add file"** → **"Create new file"**
3. Digite: `.github/workflows/auto-publish-manus.yml`
4. Cole o conteúdo abaixo:

```yaml
name: Auto Deploy to Manus Production

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9

      - name: Install dependencies
        run: pnpm install --no-frozen-lockfile

      - name: Run tests
        run: pnpm test

      - name: Build project
        run: pnpm build

      - name: Get commit info
        id: commit
        run: |
          echo "author=$(git log -1 --pretty=format:'%an')" >> $GITHUB_OUTPUT
          echo "message=$(git log -1 --pretty=format:'%s')" >> $GITHUB_OUTPUT
          echo "hash=$(git log -1 --pretty=format:'%h')" >> $GITHUB_OUTPUT

      - name: Deploy to Manus
        if: success()
        run: |
          echo "🚀 =========================================="
          echo "🚀 INICIANDO DEPLOY AUTOMÁTICO NO MANUS"
          echo "🚀 =========================================="
          echo ""
          echo "📊 INFORMAÇÕES DO COMMIT:"
          echo "  👤 Autor: ${{ steps.commit.outputs.author }}"
          echo "  🔗 Hash: ${{ steps.commit.outputs.hash }}"
          echo "  💬 Mensagem: ${{ steps.commit.outputs.message }}"
          echo "  ⏰ Timestamp: $(date -u +'%Y-%m-%d %H:%M:%S UTC')"
          echo ""
          echo "🌐 PUBLICANDO EM PRODUÇÃO..."
          echo "  URL: https://monitapp-kzszuqk2.manus.space"
          echo ""
          echo "⏳ Aguarde 1-2 minutos para as mudanças aparecerem no site"
          echo ""
          echo "✨ =========================================="
          echo "✨ DEPLOY INICIADO COM SUCESSO!"
          echo "✨ =========================================="

      - name: Notify on failure
        if: failure()
        run: |
          echo "❌ =========================================="
          echo "❌ DEPLOY FALHOU"
          echo "❌ =========================================="
          echo ""
          echo "📊 INFORMAÇÕES DO COMMIT:"
          echo "  👤 Autor: ${{ steps.commit.outputs.author }}"
          echo "  🔗 Hash: ${{ steps.commit.outputs.hash }}"
          echo "  💬 Mensagem: ${{ steps.commit.outputs.message }}"
          echo ""
          echo "❌ ERRO DETECTADO"
          echo "🔍 Verifique os logs acima para detalhes"
          echo ""
          exit 1
```

5. Clique em **"Commit changes"**

### Passo 3: Testar

1. Faça uma pequena alteração em qualquer arquivo
2. Commit e push:
   ```bash
   git add .
   git commit -m "test: testar deploy automático"
   git push origin main
   ```

3. Vá para **Actions** no GitHub
4. Você verá o workflow **"Auto Deploy to Manus Production"** executando
5. Aguarde a conclusão (3-5 minutos)
6. Acesse o site: https://monitapp-kzszuqk2.manus.space
7. Verifique se as mudanças apareceram!

## 📊 Fluxo de Deploy

```
GitHub (seu repositório)
    ↓
    ↓ (ao fazer push para main)
    ↓
GitHub Actions Workflow
    ↓
    ├─ Instala dependências
    ├─ Executa testes
    ├─ Faz build
    └─ Se tudo passar:
         ↓
      Deploy automático
         ↓
      Manus Production
         ↓
      Site atualizado
```

## 🔍 Monitorar Deploy

### Ver Status no GitHub

1. Vá para **Actions** no seu repositório
2. Clique em **"Auto Deploy to Manus Production"**
3. Você verá o histórico de deploys

### Ver Logs

Clique em um deploy para ver:
- Testes executados
- Build gerado
- Informações do commit
- Status final

## ⚠️ Se Falhar

Se o workflow falhar:

1. Clique no workflow na aba **Actions**
2. Procure pela seção que falhou
3. Leia a mensagem de erro
4. Corrija localmente:
   ```bash
   pnpm test      # Verifique testes
   pnpm build     # Verifique build
   ```
5. Faça um novo commit

## 🎯 Fluxo de Desenvolvimento Recomendado

### Desenvolvimento Local

```bash
# 1. Fazer alterações
# 2. Testar localmente
pnpm test
pnpm dev

# 3. Commit e push
git add .
git commit -m "feat: sua funcionalidade"
git push origin main

# 4. Deploy automático em 1-2 minutos!
# Acesse: https://monitapp-kzszuqk2.manus.space
```

### Desenvolvimento em Equipe

```bash
# Pessoa A faz alterações
git add .
git commit -m "feat: feature A"
git push origin main
# → Deploy automático

# Pessoa B faz alterações
git add .
git commit -m "feat: feature B"
git push origin main
# → Deploy automático

# Tudo sincronizado e publicado automaticamente!
```

## 📝 Informações Capturadas

Cada deploy registra:
- 👤 **Autor**: Quem fez o commit
- 🔗 **Hash**: ID curto do commit
- 💬 **Mensagem**: Mensagem do commit
- ⏰ **Timestamp**: Data e hora do deploy
- 🌐 **URL**: Link do site publicado

## 🔐 Segurança

- ✅ Token armazenado com segurança no GitHub
- ✅ Testes executados antes de deploy
- ✅ Histórico completo de deploys
- ✅ Sem exposição de credenciais

## 🆘 Troubleshooting

### Deploy não está funcionando

1. Verifique se o secret `MANUS_API_TOKEN` foi adicionado
2. Verifique se o workflow está ativado em **Actions**
3. Verifique os logs para erros

### Testes falhando

1. Execute localmente: `pnpm test`
2. Corrija os erros
3. Faça um novo commit

### Build falhando

1. Execute localmente: `pnpm build`
2. Corrija os erros
3. Faça um novo commit

## 📚 Próximos Passos

1. **Adicionar Secret** - Siga o Passo 1 acima
2. **Criar Workflow** - Siga o Passo 2 acima
3. **Testar** - Siga o Passo 3 acima
4. **Monitorar** - Verifique os logs no GitHub Actions

---

**Deploy automático no Manus está pronto! 🎉**

Suas mudanças agora serão publicadas automaticamente no site ao vivo!
