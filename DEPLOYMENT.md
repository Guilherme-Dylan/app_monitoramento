# Guia de Deploy - App de Monitoramento

Este documento explica como fazer deploy automático do projeto.

## 🔄 Fluxo de Deploy Automático

### 1. **Desenvolvimento Local ou no GitHub**

Faça suas alterações em uma branch:

```bash
git checkout -b feature/sua-funcionalidade
# Faça suas edições
git add .
git commit -m "feat: sua funcionalidade"
git push origin feature/sua-funcionalidade
```

### 2. **Merge para Main**

Quando pronto, faça um Pull Request e merge para `main`:

```bash
git checkout main
git pull origin main
```

Ou via GitHub:
- Abra um Pull Request
- Após aprovação, clique em "Merge pull request"

### 3. **Trigger Automático**

Quando há push para `main`, GitHub Actions automaticamente:

✅ Executa todos os testes (`pnpm test`)
✅ Faz o build do projeto (`pnpm build`)
✅ Valida o código

### 4. **Publicar no Manus**

Após os testes passarem:

1. Acesse o **Management UI** do projeto
2. Clique no botão **"Publish"** (canto superior direito)
3. Confirme a publicação
4. Aguarde o deploy completar (geralmente 1-2 minutos)

## 📊 Status do Deploy

Você pode acompanhar o status:

- **GitHub Actions**: https://github.com/Guilherme-Dylan/app_monitoramento/actions
- **Management UI**: Painel de Dashboard mostra status de publicação
- **Site ao vivo**: https://monitapp-kzszuqk2.manus.space

## 🔑 Variáveis de Ambiente

As seguintes variáveis são injetadas automaticamente:

```
DATABASE_URL          # Conexão com TiDB Cloud
JWT_SECRET            # Chave para assinar JWTs
VITE_APP_ID           # ID da aplicação Manus
OAUTH_SERVER_URL      # URL do servidor OAuth
VITE_OAUTH_PORTAL_URL # URL do portal OAuth
VITE_APP_TITLE        # Título da aplicação
VITE_APP_LOGO         # Logo da aplicação
```

## ⚠️ Rollback

Se algo der errado após o deploy:

1. Acesse o **Management UI**
2. Vá para **"Dashboard"**
3. Clique em um checkpoint anterior
4. Clique em **"Rollback"**

Isso reverte o site para o estado anterior.

## 📝 Checklist Antes de Publicar

- [ ] Todos os testes passam (`pnpm test`)
- [ ] Sem erros de TypeScript (`pnpm build`)
- [ ] Código foi revisado
- [ ] Documentação foi atualizada
- [ ] Não há console.log ou debug statements

## 🚀 Deploy Manual (Alternativa)

Se preferir fazer deploy manual:

1. Faça suas alterações
2. Commit e push para GitHub
3. Acesse o Management UI
4. Clique em **"Code"** para ver o status
5. Clique em **"Publish"** quando pronto

## 📞 Troubleshooting

### Deploy falha com erro de testes

```bash
# Verifique localmente
pnpm test

# Corrija os testes
pnpm test:watch

# Commit e push novamente
git add .
git commit -m "fix: corrigir testes"
git push
```

### Deploy falha com erro de build

```bash
# Verifique localmente
pnpm build

# Verifique TypeScript
pnpm type-check

# Corrija os erros
# Commit e push novamente
```

### Alterações não aparecem no site

1. Aguarde 2-3 minutos após o push
2. Limpe o cache do navegador (Ctrl+Shift+Delete)
3. Verifique se o deploy foi bem-sucedido no Dashboard

## 🔐 Segurança

- Nunca commite `.env` ou secrets
- Use variáveis de ambiente para dados sensíveis
- Revise Pull Requests antes de fazer merge
- Mantenha dependências atualizadas

## 📚 Recursos Úteis

- [Documentação Manus](https://docs.manus.im)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Express.js](https://expressjs.com)
- [React](https://react.dev)
- [tRPC](https://trpc.io)

---

**Dúvidas? Abra uma Issue no GitHub!**
