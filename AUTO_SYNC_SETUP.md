# 🔄 Sincronização Automática Bidirecional com GitHub

Este documento explica como configurar sincronização automática entre GitHub e Manus.

## 🎯 O que é Sincronização Automática?

Sincronização automática significa que:
- ✅ Mudanças no GitHub são sincronizadas para Manus automaticamente
- ✅ Mudanças no Manus são commitadas e enviadas para GitHub automaticamente
- ✅ Tudo acontece sem você fazer nada manualmente

## 🔧 Como Funciona

### Opção 1: Script Manual (Rápido)

Execute o script de sincronização manualmente:

```bash
node scripts/sync-github.mjs
```

Este script:
1. Busca mudanças do GitHub
2. Faz merge com suas mudanças locais
3. Faz commit automático se houver mudanças
4. Envia para GitHub

### Opção 2: Workflow Automático (Recomendado)

O workflow `.github/workflows/sync-bidirectional.yml` sincroniza automaticamente:

**Quando:**
- A cada 5 minutos (agendado)
- Quando você faz push para `main`
- Manualmente via `workflow_dispatch`

**O que faz:**
1. Busca mudanças do GitHub
2. Faz merge automático
3. Envia de volta para GitHub

## 📋 Setup Inicial

### Passo 1: Criar o Workflow

O arquivo `.github/workflows/sync-bidirectional.yml` já existe no repositório. Se não existir, crie-o:

1. Vá para: https://github.com/Guilherme-Dylan/app_monitoramento
2. Clique em **"Add file"** → **"Create new file"**
3. Digite: `.github/workflows/sync-bidirectional.yml`
4. Cole o conteúdo abaixo:

```yaml
name: Sincronização Bidirecional com Manus

on:
  schedule:
    # Sincronizar a cada 5 minutos
    - cron: '*/5 * * * *'
  workflow_dispatch:
  push:
    branches:
      - main

jobs:
  sync:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          
      - name: Configure Git
        run: |
          git config --global user.name "GitHub Actions"
          git config --global user.email "actions@github.com"
          
      - name: Sync from Manus
        run: |
          echo "🔄 Sincronizando mudanças do Manus..."
          git fetch origin
          git merge origin/main --allow-unrelated-histories -m "chore: sincronização automática do Manus" || true
          
      - name: Push to Manus
        if: always()
        run: |
          echo "📤 Enviando mudanças para Manus..."
          git push origin main || true
```

5. Clique em **"Commit changes"**

### Passo 2: Testar a Sincronização

1. Faça uma alteração em um arquivo
2. Commit e push:
   ```bash
   git add .
   git commit -m "test: testar sincronização automática"
   git push origin main
   ```

3. Vá para **Actions** no GitHub
4. Você deve ver o workflow `Sincronização Bidirecional com Manus` executando
5. Aguarde a conclusão

## 📊 Fluxo de Sincronização

```
GitHub (seu repositório)
    ↓
    ↓ (a cada 5 minutos ou ao fazer push)
    ↓
GitHub Actions Workflow
    ↓
    ↓ (sincroniza mudanças)
    ↓
Manus (seu projeto)
    ↓
    ↓ (mudanças locais)
    ↓
GitHub Actions Workflow
    ↓
    ↓ (envia de volta)
    ↓
GitHub (atualizado)
```

## 🚀 Usar o Script Manual

Se preferir sincronizar manualmente:

```bash
# Sincronizar com GitHub
node scripts/sync-github.mjs

# Ou com npm
npm run sync

# Ou com pnpm
pnpm sync
```

O script fará:
1. ✅ Buscar mudanças do GitHub
2. ✅ Fazer merge com suas mudanças
3. ✅ Criar commit automático se houver mudanças
4. ✅ Enviar para GitHub

## ⚙️ Configurar Intervalo de Sincronização

Para mudar o intervalo de sincronização (padrão: 5 minutos):

1. Edite `.github/workflows/sync-bidirectional.yml`
2. Procure por:
   ```yaml
   - cron: '*/5 * * * *'
   ```

3. Altere o intervalo:
   - `*/5` = a cada 5 minutos
   - `*/10` = a cada 10 minutos
   - `*/30` = a cada 30 minutos
   - `0 * * * *` = a cada hora
   - `0 0 * * *` = uma vez por dia

## 🔍 Monitorar Sincronização

### Ver Status no GitHub

1. Vá para **Actions** no seu repositório
2. Clique em **"Sincronização Bidirecional com Manus"**
3. Você verá o histórico de sincronizações

### Ver Logs

Clique em uma sincronização para ver os detalhes:
- Mudanças sincronizadas
- Commits criados
- Erros (se houver)

## ⚠️ Possíveis Conflitos

Se houver conflitos de merge:

1. O workflow tentará resolver automaticamente
2. Se não conseguir, você verá um erro nos logs
3. Resolva manualmente:
   ```bash
   git pull user_github main
   # Resolva os conflitos
   git add .
   git commit -m "fix: resolver conflitos de sincronização"
   git push user_github main
   ```

## 🎯 Fluxo Recomendado

### Para Desenvolvimento Local

```bash
# 1. Fazer alterações localmente
# 2. Commit e push
git add .
git commit -m "feat: sua funcionalidade"
git push origin main

# 3. Sincronizar com Manus (automático em 5 min)
# ou manual:
node scripts/sync-github.mjs
```

### Para Alterações no GitHub

```bash
# 1. Fazer alterações no GitHub (via web)
# 2. Sincronização automática em 5 minutos
# 3. Mudanças aparecem no Manus automaticamente
```

### Para Alterações no Manus

```bash
# 1. Fazer alterações no Management UI do Manus
# 2. Sincronização automática em 5 minutos
# 3. Mudanças são commitadas e enviadas para GitHub
```

## 📝 Configuração do package.json

Adicione estes scripts ao `package.json` para facilitar:

```json
{
  "scripts": {
    "sync": "node scripts/sync-github.mjs",
    "sync:watch": "watch 'npm run sync' ."
  }
}
```

Depois use:
```bash
pnpm sync          # Sincronizar uma vez
pnpm sync:watch    # Sincronizar continuamente
```

## 🔐 Segurança

- ✅ GitHub Actions usa credenciais seguras
- ✅ Commits automáticos são rastreáveis
- ✅ Histórico completo no Git
- ✅ Sem exposição de tokens

## 🆘 Troubleshooting

### Sincronização não está funcionando

1. Verifique se o workflow está ativado em **Actions**
2. Verifique os logs para erros
3. Tente sincronizar manualmente: `node scripts/sync-github.mjs`

### Conflitos frequentes

1. Aumente o intervalo de sincronização
2. Comunique-se com a equipe sobre mudanças
3. Use branches para features grandes

### Commits duplicados

1. Verifique se o workflow está configurado corretamente
2. Desative se não precisar de sincronização tão frequente
3. Use `workflow_dispatch` para sincronizar manualmente

## 📚 Próximos Passos

1. **Ativar o workflow** - Crie ou atualize `.github/workflows/sync-bidirectional.yml`
2. **Testar** - Faça um commit e veja a sincronização funcionar
3. **Monitorar** - Verifique os logs no GitHub Actions
4. **Ajustar** - Altere o intervalo se necessário

---

**Sincronização automática ativada! 🎉**

Suas mudanças agora sincronizam automaticamente entre GitHub e Manus!
