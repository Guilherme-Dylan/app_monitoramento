# Fluxo de Trabalho em Equipe - App de Monitoramento

Este documento descreve como toda a equipe deve trabalhar para contribuir com o projeto.

## 👥 Papéis e Responsabilidades

### Desenvolvedor
- Cria branches para novas funcionalidades
- Faz commits com mensagens claras
- Escreve testes para suas alterações
- Abre Pull Requests para revisão

### Revisor
- Revisa o código do Pull Request
- Executa os testes localmente
- Aprova ou pede mudanças
- Faz o merge para `main`

### DevOps / Mantenedor
- Monitora o status dos workflows
- Publica alterações no Manus
- Gerencia secrets e variáveis de ambiente
- Resolve problemas de deploy

## 🔄 Fluxo Padrão de Desenvolvimento

### 1️⃣ Planejamento

```
Issue criada → Discussão → Atribuição → Desenvolvimento
```

- Abra uma Issue descrevendo a funcionalidade/bug
- Discuta a abordagem com a equipe
- Atribua a si mesmo
- Comece o desenvolvimento

### 2️⃣ Desenvolvimento Local

```bash
# Clone o repositório
git clone https://github.com/Guilherme-Dylan/app_monitoramento.git
cd app_monitoramento

# Crie uma branch
git checkout -b feature/minha-funcionalidade

# Instale dependências
pnpm install

# Faça suas alterações
# ... edite arquivos ...

# Teste localmente
pnpm dev          # Servidor de desenvolvimento
pnpm test         # Execute testes
pnpm build        # Faça o build
```

### 3️⃣ Commit e Push

```bash
# Verifique as mudanças
git status

# Adicione os arquivos
git add .

# Commit com mensagem clara
git commit -m "feat: adicionar nova funcionalidade"

# Push para sua branch
git push origin feature/minha-funcionalidade
```

### 4️⃣ Pull Request

1. Acesse https://github.com/Guilherme-Dylan/app_monitoramento
2. Clique em **"Compare & pull request"**
3. Preencha o template:
   - **Título**: Breve descrição
   - **Descrição**: Detalhes da mudança
   - **Linked Issues**: Relacione a Issue
   - **Testing**: Descreva como testar

4. Clique em **"Create pull request"**

### 5️⃣ Revisão de Código

O revisor:
- [ ] Executa `pnpm install && pnpm test`
- [ ] Revisa o código
- [ ] Testa localmente
- [ ] Aprova ou pede mudanças

### 6️⃣ Merge

Quando aprovado:
1. Revisor clica em **"Merge pull request"**
2. GitHub Actions executa automaticamente
3. Testes e build são validados

### 7️⃣ Deploy

Após merge bem-sucedido:
1. Acesse o **Management UI** do Manus
2. Clique em **"Publish"**
3. Aguarde 1-2 minutos
4. Site atualiza automaticamente

## 📋 Checklist de Pull Request

Antes de abrir um PR, verifique:

- [ ] Branch criada a partir de `main` atualizada
- [ ] Commits com mensagens claras e descritivas
- [ ] Testes escritos e passando (`pnpm test`)
- [ ] Build sem erros (`pnpm build`)
- [ ] Sem console.log ou código de debug
- [ ] Documentação atualizada
- [ ] Sem conflitos com `main`

## 🧪 Padrão de Testes

Escreva testes para suas funcionalidades:

```typescript
import { describe, it, expect } from "vitest";

describe("Minha Funcionalidade", () => {
  it("deve fazer X quando Y", async () => {
    // Arrange - preparar dados
    const input = "teste";
    
    // Act - executar função
    const result = await minhaFuncao(input);
    
    // Assert - verificar resultado
    expect(result).toBe("esperado");
  });

  it("deve lançar erro quando Z", async () => {
    expect(() => minhaFuncao(null)).toThrow();
  });
});
```

Execute com:
```bash
pnpm test              # Todos os testes
pnpm test:watch       # Modo watch
pnpm test -- --ui     # Interface visual
```

## 📝 Padrão de Commits

Use o formato Conventional Commits:

```
<tipo>(<escopo>): <descrição>

<corpo>

<rodapé>
```

### Tipos

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação (sem mudança lógica)
- `refactor:` - Refatoração
- `test:` - Testes
- `chore:` - Manutenção
- `perf:` - Performance

### Exemplos

```
feat(visitas): adicionar filtro por data

Permite que admins filtrem visitas por intervalo de datas.
Adiciona componente DateRangePicker e função de filtro no backend.

Fixes #123
```

```
fix(auth): corrigir erro de autenticação com cookies

O cookie não era enviado em requisições subsequentes.
Alterado SameSite para 'lax' para desenvolvimento.

Fixes #456
```

## 🚀 Estratégia de Deploy

### Ambiente de Desenvolvimento
- URL: https://3000-ioss52xctewzlnbx4pkre-6be19a97.us1.manus.computer
- Atualiza automaticamente ao fazer push para `main`

### Ambiente de Produção
- URL: https://monitapp-kzszuqk2.manus.space
- Atualiza manualmente via **"Publish"** no Management UI
- Requer aprovação de PR antes

### Rollback

Se algo der errado em produção:

1. Acesse **Management UI** → **Dashboard**
2. Clique em um checkpoint anterior
3. Clique em **"Rollback"**
4. Site volta ao estado anterior em 1-2 minutos

## 🔐 Secrets e Variáveis

### Variáveis de Ambiente

Definidas automaticamente pelo Manus:
- `DATABASE_URL`
- `JWT_SECRET`
- `VITE_APP_ID`
- `OAUTH_SERVER_URL`
- etc.

### Adicionar Nova Variável

1. Acesse **Management UI** → **Settings** → **Secrets**
2. Clique em **"Add secret"**
3. Preencha `key` e `value`
4. Salve

### Nunca Commite

- `.env` ou `.env.local`
- Tokens ou API keys
- Senhas ou dados sensíveis

## 📊 Monitoramento

### Status do Projeto

- **GitHub**: https://github.com/Guilherme-Dylan/app_monitoramento
- **Actions**: https://github.com/Guilherme-Dylan/app_monitoramento/actions
- **Manus Dashboard**: Acesse via Management UI

### Verificar Logs

```bash
# Ver commits recentes
git log --oneline -10

# Ver branches
git branch -a

# Ver status
git status
```

## 🆘 Troubleshooting

### Conflito de merge

```bash
# Atualize sua branch
git fetch origin
git rebase origin/main

# Resolva conflitos nos arquivos
# Depois
git add .
git rebase --continue
git push -f origin feature/sua-branch
```

### Testes falhando

```bash
# Execute localmente
pnpm test

# Modo watch para debug
pnpm test:watch

# Veja qual teste falha
# Corrija o código
# Commit e push novamente
```

### Build falhando

```bash
# Verifique TypeScript
pnpm build

# Veja os erros
# Corrija o código
# Commit e push novamente
```

## 📚 Recursos

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Vitest Documentation](https://vitest.dev/)

## 📞 Comunicação

- **Issues**: Para discussões sobre funcionalidades/bugs
- **Pull Requests**: Para revisão de código
- **Discussions**: Para perguntas gerais

---

**Bem-vindo à equipe! 🎉**
