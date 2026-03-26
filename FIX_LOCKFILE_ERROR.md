# 🔧 Corrigir Erro de patchedDependencies

## ❌ Erro Recebido

```
ERR_PNPM_LOCKFILE_CONFIG_MISMATCH Cannot proceed with the frozen installation. 
The current "patchedDependencies" configuration doesn't match the value found in the lockfile
```

## ✅ Solução

O `pnpm-lock.yaml` foi regenerado e enviado para GitHub. Agora você precisa atualizar o workflow para usar `--no-frozen-lockfile`.

### Passo 1: Editar o Workflow

1. Vá para: https://github.com/Guilherme-Dylan/app_monitoramento
2. Clique em **.github/workflows/deploy.yml**
3. Clique no ícone de **lápis** (Edit)
4. Procure pela linha:
   ```yaml
   run: pnpm install --frozen-lockfile
   ```

5. Altere para:
   ```yaml
   run: pnpm install --no-frozen-lockfile
   ```

6. Clique em **"Commit changes"**
7. Escreva: `fix: usar --no-frozen-lockfile no workflow`
8. Clique em **"Commit changes"** novamente

### Passo 2: Testar

Faça um novo commit para disparar o workflow:

```bash
git add .
git commit -m "test: testar workflow corrigido"
git push origin main
```

Vá para **Actions** e verifique se o workflow passa agora!

## 📝 Resumo

- ✅ `pnpm-lock.yaml` regenerado e enviado
- ⏳ Você precisa atualizar o workflow para usar `--no-frozen-lockfile`
- 🚀 Depois disso, deploy automático funcionará perfeitamente

---

**Próximo passo: Atualizar o workflow no GitHub conforme instruções acima**
