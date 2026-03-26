# Guia de Colaboração - App de Monitoramento

Este documento explica como colaboradores podem contribuir com alterações no projeto.

## 📋 Pré-requisitos

- Git instalado
- Node.js 22+
- pnpm instalado (`npm install -g pnpm`)
- Acesso ao repositório GitHub

## 🚀 Como Contribuir

### 1. Clone o Repositório

```bash
git clone https://github.com/Guilherme-Dylan/app_monitoramento.git
cd app_monitoramento
```

### 2. Crie uma Branch para sua Alteração

```bash
git checkout -b feature/sua-funcionalidade
# ou
git checkout -b fix/seu-bug-fix
```

### 3. Instale as Dependências

```bash
pnpm install
```

### 4. Faça suas Alterações

- Edite os arquivos necessários
- Siga o padrão de código do projeto
- Adicione testes para novas funcionalidades

### 5. Teste suas Alterações

```bash
# Executar todos os testes
pnpm test

# Executar testes em modo watch
pnpm test:watch

# Executar servidor de desenvolvimento
pnpm dev
```

### 6. Commit e Push

```bash
git add .
git commit -m "feat: descrição clara da sua alteração"
git push origin feature/sua-funcionalidade
```

### 7. Abra um Pull Request

- Vá para https://github.com/Guilherme-Dylan/app_monitoramento
- Clique em "New Pull Request"
- Descreva suas alterações claramente
- Aguarde revisão

## 📝 Padrão de Commits

Use o seguinte padrão para mensagens de commit:

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Alterações em documentação
- `style:` - Formatação de código
- `refactor:` - Refatoração de código
- `test:` - Adição/alteração de testes
- `chore:` - Tarefas de manutenção

Exemplos:
```
feat: adicionar filtro de data na aba de visitas
fix: corrigir erro de formatação de data
docs: atualizar README com instruções de deploy
```

## 🔄 Fluxo de Deploy Automático

Quando você faz push para a branch `main`:

1. ✅ GitHub Actions executa testes automaticamente
2. ✅ Se os testes passarem, o build é criado
3. 📦 O projeto fica pronto para publicação
4. 🚀 Clique em "Publish" no Management UI para publicar

## 📂 Estrutura do Projeto

```
monitoramento_app/
├── client/              # Frontend React
│   ├── src/
│   │   ├── pages/      # Páginas da aplicação
│   │   ├── components/ # Componentes reutilizáveis
│   │   └── lib/        # Utilitários e hooks
│   └── public/         # Arquivos estáticos
├── server/             # Backend Express + tRPC
│   ├── routers.ts      # Definição de rotas tRPC
│   ├── db.ts           # Funções de banco de dados
│   └── *.test.ts       # Testes unitários
├── drizzle/            # Schema do banco de dados
└── .github/workflows/  # GitHub Actions
```

## 🧪 Escrevendo Testes

Adicione testes para suas novas funcionalidades:

```typescript
import { describe, it, expect } from "vitest";

describe("Sua Funcionalidade", () => {
  it("deve fazer algo específico", async () => {
    // Arrange
    const input = "teste";
    
    // Act
    const result = await suaFuncao(input);
    
    // Assert
    expect(result).toBe("esperado");
  });
});
```

Execute os testes com:
```bash
pnpm test
```

## 🐛 Reportando Bugs

Se encontrar um bug:

1. Verifique se já não foi reportado em Issues
2. Crie uma nova Issue com:
   - Descrição clara do problema
   - Passos para reproduzir
   - Comportamento esperado vs. atual
   - Screenshots (se aplicável)

## 📞 Dúvidas?

Se tiver dúvidas sobre como contribuir, abra uma Issue ou entre em contato com o mantenedor.

---

**Obrigado por contribuir! 🙏**
