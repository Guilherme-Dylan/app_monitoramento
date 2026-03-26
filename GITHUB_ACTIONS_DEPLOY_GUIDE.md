# 🚀 Guia de Deploy Manual via GitHub Actions

## O Problema

O GitHub Actions workflow não está sendo disparado automaticamente ao fazer push porque há restrições de permissão no repositório. Mas você pode **disparar manualmente** o workflow a qualquer momento!

## ✅ Como Fazer Deploy Manualmente

### Método 1: Via GitHub Web Interface (Recomendado)

1. Acesse seu repositório: https://github.com/Guilherme-Dylan/app_monitoramento
2. Clique na aba **"Actions"**
3. Clique em **"Auto Deploy to Manus Production"** (no lado esquerdo)
4. Clique no botão azul **"Run workflow"**
5. Selecione a branch **main** (já vem selecionada)
6. Clique em **"Run workflow"** novamente
7. ⏳ Aguarde 1-2 minutos

### Método 2: Via GitHub CLI (Terminal)

```bash
gh workflow run auto-publish-manus.yml -r main
```

### Método 3: Via curl (Terminal)

```bash
curl -X POST \
  -H "Authorization: token SEU_TOKEN_AQUI" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/Guilherme-Dylan/app_monitoramento/actions/workflows/auto-publish-manus.yml/dispatches \
  -d '{"ref":"main"}'
```

## 📊 O Que Acontece Durante o Deploy

1. ✅ **Checkout** - Baixa o código mais recente
2. ✅ **Setup Node.js** - Configura ambiente
3. ✅ **Install pnpm** - Instala gerenciador de pacotes
4. ✅ **Install dependencies** - Instala dependências
5. ✅ **Run tests** - Executa testes (39 testes)
6. ✅ **Build project** - Faz build do projeto
7. ✅ **Deploy to Manus** - Publica no site ao vivo

## 🌐 URL do Site

Após o deploy, acesse: https://monitapp-kzszuqk2.manus.space

## ⏱️ Tempo de Deploy

- **Execução do workflow**: 2-3 minutos
- **Atualização do site**: 1-2 minutos após o workflow terminar
- **Total**: 3-5 minutos

## 📝 Dicas

- Você pode ver o progresso do workflow em tempo real na aba **Actions**
- Se o workflow falhar, você verá a mensagem de erro na aba **Actions**
- Todos os logs estão disponíveis para debug

## 🔄 Próximas Vezes

Basta repetir os passos acima sempre que quiser fazer deploy!

## 🎯 Objetivo Final: Auto-Deploy Totalmente Automático

Estamos trabalhando para fazer o deploy ser disparado **automaticamente** quando você faz um commit. Quando isso estiver pronto, você não precisará fazer nada - o site será atualizado automaticamente!
