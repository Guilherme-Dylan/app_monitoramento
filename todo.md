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
