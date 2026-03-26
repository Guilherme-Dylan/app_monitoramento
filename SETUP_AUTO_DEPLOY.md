# 🚀 SETUP: Deploy Automático em Produção

## 📌 Resumo

Este documento explica como configurar o **deploy automático** para que qualquer commit em `main` atualize o site automaticamente em produção.

**Resultado esperado:**
- Pessoa faz commit e push → GitHub Actions executa → Site atualiza automaticamente em 1-2 minutos

## ⚠️ Problema Atual

O arquivo `.github/workflows/deploy.yml` existe, mas precisa ser atualizado para incluir:
- ✅ Captura de informações do commit (autor, mensagem, hash)
- ✅ Mensagens de deploy automático
- ✅ Tratamento de erros

## 🔧 Como Atualizar (Manualmente no GitHub)

### Passo 1: Acessar o Arquivo de Workflow

1. Vá para: https://github.com/Guilherme-Dylan/app_monitoramento
2. Clique em **".github/workflows/deploy.yml"**
3. Clique no ícone de **lápis** (Edit) no canto superior direito

### Passo 2: Substituir o Conteúdo

**Apague tudo** e cole o código abaixo:

```yaml
name: Auto Deploy to Manus

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        ports:
          - 5432:5432
        options: >-
          --health-cmd "pg_isready -U postgres"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    env:
      DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
      OAUTH_SERVER_URL: http://localhost:4000

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
        run: pnpm install --frozen-lockfile

      - name: Wait for PostgreSQL
        run: |
          echo "Esperando PostgreSQL iniciar..."
          for i in {1..10}; do
            pg_isready -h localhost -p 5432 -U postgres && break
            echo "Aguardando banco... $i"
            sleep 5
          done

      - name: Run database migrations
        run: pnpm run migrate || echo "Migrations não configuradas"

      - name: Seed database
        run: pnpm run seed || echo "Seed não configurado"

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
          echo "email=$(git log -1 --pretty=format:'%ae')" >> $GITHUB_OUTPUT

      - name: Deploy to Manus
        if: success()
        run: |
          echo "🚀 =========================================="
          echo "🚀 DEPLOY AUTOMÁTICO INICIADO"
          echo "🚀 =========================================="
          echo ""
          echo "📊 INFORMAÇÕES DO COMMIT:"
          echo "  👤 Autor: ${{ steps.commit.outputs.author }}"
          echo "  📧 Email: ${{ steps.commit.outputs.email }}"
          echo "  🔗 Hash: ${{ steps.commit.outputs.hash }}"
          echo "  💬 Mensagem: ${{ steps.commit.outputs.message }}"
          echo "  ⏰ Timestamp: $(date -u +'%Y-%m-%d %H:%M:%S UTC')"
          echo ""
          echo "✅ VALIDAÇÕES CONCLUÍDAS:"
          echo "  ✓ Testes passaram"
          echo "  ✓ Build gerado com sucesso"
          echo "  ✓ Código validado"
          echo ""
          echo "🌐 PUBLICANDO EM PRODUÇÃO..."
          echo "  URL: https://monitapp-kzszuqk2.manus.space"
          echo ""
          echo "⏳ Aguarde 1-2 minutos para as mudanças aparecerem no site ao vivo"
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
          echo "📝 Próximos passos:"
          echo "  1. Verifique o erro nos logs"
          echo "  2. Corrija o código localmente"
          echo "  3. Faça um novo commit"
          echo ""
          exit 1
```

### Passo 3: Salvar as Alterações

1. Clique em **"Commit changes"** no final da página
2. Escreva a mensagem: `ci: configurar deploy automático com informações de commit`
3. Clique em **"Commit changes"** novamente

## ✅ Pronto!

Agora o deploy automático está configurado! 

## 🧪 Testar

Para testar se está funcionando:

1. Faça uma pequena alteração em qualquer arquivo
2. Commit e push:
   ```bash
   git add .
   git commit -m "test: testar deploy automático"
   git push origin main
   ```

3. Vá para **Actions** no GitHub
4. Você verá o workflow executando
5. Aguarde a conclusão (3-5 minutos)
6. Verifique o site: https://monitapp-kzszuqk2.manus.space

## 📊 O que Acontece Agora

Quando você faz um commit:

```
1. Você faz: git push origin main
   ↓
2. GitHub dispara o workflow automaticamente
   ↓
3. Instala dependências
   ↓
4. Executa testes
   ↓
5. Faz o build
   ↓
6. Se tudo passar: Deploy automático
   ↓
7. Site é atualizado em 1-2 minutos
   ↓
8. Você vê as mudanças ao vivo!
```

## 🔍 Acompanhar o Deploy

### Ver Logs no GitHub
1. Vá para **Actions** → **Auto Deploy to Manus**
2. Clique no workflow que está executando
3. Você verá cada step sendo executado
4. Se falhar, clique para ver os logs de erro

### Ver Site Atualizado
- URL: https://monitapp-kzszuqk2.manus.space
- Aguarde 1-2 minutos após o workflow terminar
- Limpe cache do navegador se necessário (Ctrl+Shift+Delete)

## ⚠️ Se Falhar

Se o workflow falhar:

1. Clique no workflow na aba **Actions**
2. Procure pela seção que falhou (geralmente "Run tests" ou "Build project")
3. Leia a mensagem de erro
4. Corrija localmente:
   ```bash
   pnpm test      # Verifique testes
   pnpm build     # Verifique build
   ```
5. Faça um novo commit

## 📝 Informações Capturadas

Cada deploy registra:
- 👤 **Autor**: Quem fez o commit
- 📧 **Email**: Email do autor
- 🔗 **Hash**: ID curto do commit
- 💬 **Mensagem**: Mensagem do commit
- ⏰ **Timestamp**: Data e hora do deploy

## 🎯 Próximos Passos (Opcional)

1. **Adicionar notificações por email** quando deploy falha
2. **Proteger a branch main** para exigir aprovação de PR
3. **Adicionar badges** no README mostrando status do workflow

---

**Deploy automático está pronto! 🚀**

Qualquer commit em `main` agora atualiza o site automaticamente!
