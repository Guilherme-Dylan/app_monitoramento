# Configurar GitHub Actions para Auto-Deploy

Este guia explica como configurar o workflow de auto-deploy no GitHub.

## 🔧 Passo 1: Criar o Arquivo de Workflow

1. Acesse seu repositório no GitHub: https://github.com/Guilherme-Dylan/app_monitoramento
2. Clique em **"Add file"** → **"Create new file"**
3. Digite o caminho: `.github/workflows/deploy.yml`
4. Cole o conteúdo abaixo:

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
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
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
        
      - name: Run tests
        run: pnpm test
        
      - name: Build project
        run: pnpm build
        
      - name: Notify deployment
        if: success()
        run: |
          echo "✅ Build e testes passaram com sucesso!"
          echo "📦 Projeto pronto para deploy"
          echo "🚀 Para publicar, acesse o Management UI e clique em 'Publish'"
```

5. Clique em **"Commit changes"**
6. Escreva a mensagem: `ci: adicionar workflow de auto-deploy`
7. Clique em **"Commit changes"**

## ✅ Passo 2: Verificar o Workflow

1. Vá para a aba **"Actions"** do seu repositório
2. Você deve ver o workflow `Auto Deploy to Manus` listado
3. Clique nele para ver os detalhes

## 🔄 Passo 3: Testar o Workflow

Para testar se o workflow funciona:

1. Faça uma pequena alteração em um arquivo
2. Commit e push para `main`:
   ```bash
   git add .
   git commit -m "test: testar workflow"
   git push origin main
   ```
3. Vá para a aba **"Actions"** e acompanhe a execução

## 📊 O que o Workflow Faz

Quando você faz push para `main`, o workflow automaticamente:

1. ✅ **Checkout** - Baixa o código
2. ✅ **Setup Node.js** - Instala Node.js 22
3. ✅ **Install pnpm** - Instala gerenciador de pacotes
4. ✅ **Install dependencies** - Instala dependências do projeto
5. ✅ **Run tests** - Executa `pnpm test`
6. ✅ **Build project** - Executa `pnpm build`
7. ✅ **Notify** - Mostra mensagem de sucesso

## 🚀 Deploy Manual

Após o workflow passar:

1. Acesse o **Management UI** do Manus
2. Clique em **"Publish"** (canto superior direito)
3. Confirme a publicação
4. Aguarde 1-2 minutos para o site atualizar

## ⚠️ Se o Workflow Falhar

Se o workflow falhar:

1. Clique no workflow na aba **"Actions"**
2. Veja qual step falhou
3. Leia a mensagem de erro
4. Corrija o problema localmente
5. Commit e push novamente

Exemplos de falhas comuns:

- **Testes falhando**: Execute `pnpm test` localmente e corrija
- **Build falhando**: Execute `pnpm build` localmente e corrija
- **Dependências faltando**: Execute `pnpm install` localmente

## 🔐 Segurança

- O workflow NÃO tem acesso a secrets sensíveis
- Apenas testa e faz build do código
- O deploy real é feito manualmente via Management UI
- Isso garante que apenas código aprovado é publicado

## 📝 Customizações

Você pode customizar o workflow editando `.github/workflows/deploy.yml`:

### Adicionar notificação por email

```yaml
- name: Send email notification
  if: failure()
  uses: davisnetwork/action-send-email@v1
  with:
    to: seu-email@example.com
    subject: "Deploy falhou!"
    body: "O workflow falhou. Verifique em: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"
```

### Executar apenas em certas horas

```yaml
on:
  push:
    branches:
      - main
  schedule:
    - cron: '0 9 * * 1-5'  # De segunda a sexta às 9h
```

### Adicionar aprovação manual

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production  # Requer aprovação
    steps:
      # ... resto do workflow
```

## 📚 Recursos

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

---

**Dúvidas? Abra uma Issue no repositório!**
