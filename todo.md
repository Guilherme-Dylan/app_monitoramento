# App de Monitoramento Empresarial - TODO

## Funcionalidades Principais

### Autenticação e Usuários
- [x] Sistema de cadastro de usuários
- [x] Sistema de login
- [x] Logout
- [x] Primeiros 2 usuários como administradores
- [x] Controle de acesso baseado em role (user/admin)

### Funcionalidades de Usuário Regular
- [x] Solicitação de Busca (com nome, dados pessoais, setor de trabalho)
- [x] Denúncia Anônima (sem necessidade de login)
- [x] Visualizar status de suas solicitações
- [x] Visualizar histórico de suas solicitações

### Funcionalidades de Administrador/Desenvolvedor
- [x] Visualizar todas as solicitações gerais
- [x] Alterar status de solicitações (aceito/negado)
- [x] Visualizar denúncias anônimas
- [x] Gerar relatório em PDF com histórico de solicitações
- [x] Dashboard administrativo

### Design e Interface
- [x] Design simples e intuitivo
- [x] Interface responsiva (mobile, tablet, desktop)
- [x] Navegação clara e fácil de compreender
- [x] Temas de cores profissionais para uso empresarial

### Banco de Dados
- [x] Tabela de usuários
- [x] Tabela de solicitações de busca
- [x] Tabela de denúncias anônimas
- [x] Relacionamentos e índices apropriados

### API e Lógica de Negócio
- [x] Endpoints tRPC para criar solicitação
- [x] Endpoints tRPC para criar denúncia
- [x] Endpoints tRPC para listar solicitações (admin)
- [x] Endpoints tRPC para atualizar status
- [x] Endpoints tRPC para gerar relatório PDF
- [x] Validações apropriadas

### Testes
- [ ] Testes unitários para procedimentos tRPC
- [ ] Testes de autenticação
- [ ] Testes de autorização

## Progresso Geral
- Projeto inicializado com stack: React 19, TailwindCSS 4, Express 4, tRPC 11, Drizzle ORM
- Banco de dados: MySQL
- Autenticação: Manus OAuth


## Bugs Reportados
- [x] Endpoint /api/generate-pdf não implementado - PDF não abre (CORRIGIDO)

## Novas Solicitações
- [x] Gerar dois usuários administradores no banco de dados (CONCLUÍDO)
- [x] Implementar login com email e senha (CONCLUÍDO)
- [x] Criar página de login com formulário (CONCLUÍDO)
- [x] Criar página de registro (CONCLUÍDO)

## Novas Funcionalidades Solicitadas
- [ ] Implementar login com email e senha (sem OAuth)
- [ ] Criar usuários administradores com credenciais de email/senha


## Bugs Reportados - Sessão Atual
- [x] Login com email/senha não está funcionando (CORRIGIDO - Implementada criação de sessão JWT)

## Bugs Reportados - Nova Sessão
- [x] Registro manual no site não permite login posterior (CORRIGIDO - Adicionado logging e testes de validação)

## Bugs Corrigidos - Última Sessão
- [x] Login mostra mensagem de sucesso mas não autentica o usuário (CORRIGIDO - Invalidado cache de auth.me após login/registro)


## Novas Funcionalidades - Sessão Atual
- [ ] Filtro por data no relatório PDF
- [ ] Seletor de data na página de relatórios
- [ ] Gerar PDF apenas com dados da data selecionada


## Novas Funcionalidades Implementadas
- [x] Filtro por data no relatório PDF
- [x] Seletor de data na página de relatórios
- [x] Gerar PDF apenas com dados da data selecionada
- [x] Testes para filtro de data


## Bugs Reportados - Filtro de Data
- [x] Filtro de data não está funcionando - PDF gerado com todos os dados (CORRIGIDO)
- [x] Horário do relatório está em GMT-3 em vez de UTC (CORRIGIDO - Implementado date-fns-tz)


## Bugs Críticos - Sessão Atual
- [x] Filtragem de data no relatório não está funcionando - PDF vem com todos os dados (CORRIGIDO)


## Alterações Solicitadas - Sessão Atual
- [x] Atualizar schema do banco de dados com novos nomes de colunas (nome, tipo_de_user, senha)
- [x] Remover opção de registro/criar conta do frontend
- [x] Atualizar código para usar novos nomes de colunas
- [x] Atualizar testes para novos nomes de colunas


## Bugs Críticos - Nova Sessão
- [x] Login está redirecionando para OAuth ao invés de usar autenticação local (CORRIGIDO)
- [x] Remover integração OAuth completamente (CORRIGIDO)
- [x] Usar apenas email/senha para login (CORRIGIDO)


## Bugs em Investigação - Sessão Atual
- [x] Login ainda está redirecionando para OAuth mesmo após remoção (CORRIGIDO - Removido getLoginUrl do DashboardLayout)
