# 🚀 Guia: Deploy Vercel com MySQL Local

Este guia mostra como fazer deploy do seu app na Vercel mantendo o banco de dados MySQL local na sua máquina.

---

## ⚠️ Importante

Para que isso funcione:
- **Sua máquina precisa estar SEMPRE ligada**
- **Seu router precisa permitir acesso externo à porta 3306 (MySQL)**
- **Sua internet precisa ser estável**

Se alguma dessas condições não for atendida, o app não funcionará quando sua máquina estiver desligada.

---

## 🔧 PASSO 1: Configurar MySQL para Acesso Remoto

### 1.1 Abrir MySQL Workbench
1. Abra MySQL Workbench
2. Conecte ao seu banco local

### 1.2 Permitir Acesso Remoto
1. Clique em **"Administration"** (no menu esquerdo)
2. Clique em **"Users and Privileges"**
3. Selecione seu usuário (ex: `root`)
4. Clique na aba **"Administrative Roles"**
5. Marque a opção **"DBA"** (Database Administrator)
6. Clique em **"Apply"**

### 1.3 Configurar MySQL para Ouvir em Todas as Interfaces
1. Abra o arquivo de configuração do MySQL:
   - **Windows**: `C:\ProgramData\MySQL\MySQL Server 8.0\my.ini`
   - **Mac**: `/usr/local/etc/my.cnf`
   - **Linux**: `/etc/mysql/mysql.conf.d/mysqld.cnf`

2. Procure pela linha: `bind-address = 127.0.0.1`

3. Altere para: `bind-address = 0.0.0.0`

4. Salve o arquivo

5. **Reinicie o MySQL:**
   - **Windows**: 
     - Abra Services (services.msc)
     - Procure por "MySQL80" (ou sua versão)
     - Clique com botão direito → Restart
   - **Mac/Linux**: 
     ```bash
     sudo systemctl restart mysql
     ```

---

## 🌐 PASSO 2: Configurar Seu Router para Acesso Externo

### 2.1 Port Forwarding
1. Abra seu roteador (geralmente em `192.168.1.1` ou `192.168.0.1`)
2. Faça login com suas credenciais
3. Procure por **"Port Forwarding"** ou **"Encaminhamento de Porta"**
4. Configure:
   - **Porta Externa**: `3306`
   - **Porta Interna**: `3306`
   - **IP Interno**: Seu IP local (ex: `192.168.1.100`)
5. Salve as configurações

### 2.2 Descobrir Seu IP Externo
1. Acesse [https://www.whatismyipaddress.com](https://www.whatismyipaddress.com)
2. Copie seu **IPv4 Address** (ex: `203.0.113.45`)
3. Guarde esse número - você precisará dele!

---

## 🧪 PASSO 3: Testar Conexão Remota

### 3.1 Testar do MySQL Workbench
1. Abra MySQL Workbench
2. Clique em **"+"** para nova conexão
3. Preencha:
   - **Connection Name**: `Remote Test`
   - **Hostname**: Seu IP externo (ex: `203.0.113.45`)
   - **Port**: `3306`
   - **Username**: `root` (ou seu usuário)
   - **Password**: Sua senha
4. Clique em **"Test Connection"**
5. Se funcionar, você verá: **"Connection successful"** ✅

Se não funcionar, verifique:
- Port Forwarding está configurado?
- Firewall está bloqueando?
- MySQL está escutando em `0.0.0.0`?

---

## 🌐 PASSO 4: Criar Conta Vercel

### 4.1 Acessar Vercel
1. Acesse [https://vercel.com](https://vercel.com)
2. Clique em **"Sign up"**
3. Escolha **"Continue with GitHub"**
4. Autorize a conexão

### 4.2 Importar Projeto
1. Após fazer login, clique em **"Add New"** → **"Project"**
2. Clique em **"Import Git Repository"**
3. Procure por `Guilherme-Dylan/app_monitoramento`
4. Clique em **"Import"**

---

## ⚙️ PASSO 5: Configurar Variáveis de Ambiente na Vercel

### 5.1 Acessar Configurações
1. Na página do projeto Vercel, clique em **"Settings"**
2. Clique em **"Environment Variables"** (no menu esquerdo)

### 5.2 Adicionar DATABASE_URL
Clique em **"Add New"** e preencha:

- **Name**: `DATABASE_URL`
- **Value**: `mysql://root:sua_senha@seu_ip_externo:3306/monitoramento_app`

**Exemplo:**
```
mysql://root:senha123@203.0.113.45:3306/monitoramento_app
```

### 5.3 Adicionar Outras Variáveis
Clique em **"Add New"** para cada uma:

| Nome | Valor |
|------|-------|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | Gere uma chave aleatória |
| `VITE_APP_ID` | `sk-zSYVhtrBDRXqlTu576SieZw4r3EbLaHa9InY6gvkzw_NmxFb0rWdLn7iROCOKFcK90FXG--rDNXnXazLlzCtWvhUVwg7` |
| `OAUTH_SERVER_URL` | `https://api.manus.im` |
| `VITE_OAUTH_PORTAL_URL` | `https://manus.im` |
| `BUILT_IN_FORGE_API_URL` | `https://api.manus.im` |
| `BUILT_IN_FORGE_API_KEY` | `sk-zSYVhtrBDRXqlTu576SieZw4r3EbLaHa9InY6gvkzw_NmxFb0rWdLn7iROCOKFcK90FXG--rDNXnXazLlzCtWvhUVwg7` |
| `VITE_FRONTEND_FORGE_API_KEY` | `sk-zSYVhtrBDRXqlTu576SieZw4r3EbLaHa9InY6gvkzw_NmxFb0rWdLn7iROCOKFcK90FXG--rDNXnXazLlzCtWvhUVwg7` |
| `VITE_FRONTEND_FORGE_API_URL` | `https://api.manus.im` |
| `VITE_APP_TITLE` | `Monitoramento App` |
| `VITE_APP_LOGO` | `/logo.svg` |
| `OWNER_NAME` | `Dylan` |
| `OWNER_OPEN_ID` | Seu ID Manus (pode deixar em branco) |

---

## 🚀 PASSO 6: Fazer Deploy

### 6.1 Iniciar Deploy
1. Volte para a página principal do projeto
2. Clique em **"Deployments"** (no topo)
3. Você verá um deploy em progresso
4. Aguarde até aparecer ✅ (verde)

### 6.2 Acessar App
1. Clique no deploy verde
2. Clique em **"Visit"** ou copie a URL
3. Seu app estará disponível em: `https://seu-projeto.vercel.app`

---

## ✅ PASSO 7: Testar Funcionalidades

### 7.1 Testar Login
1. Acesse a URL do seu app
2. Clique em **"Login"**
3. Faça login com sua conta Manus
4. Verifique se aparece o painel administrativo

### 7.2 Testar Denúncia Anônima
1. Volte para Home
2. Clique em **"Fazer Denúncia"**
3. Preencha o formulário
4. Clique em **"Enviar"**
5. Verifique se a denúncia aparece no painel admin

### 7.3 Testar Solicitação de Busca
1. Faça login
2. Clique em **"Nova Solicitação"**
3. Preencha os dados
4. Clique em **"Enviar"**
5. Verifique se aparece no painel admin

---

## 🔄 PASSO 8: Deploy Automático

### 8.1 Deploy Automático (Já Configurado!)
- Sempre que você fizer um `git push` no GitHub, a Vercel fará deploy automaticamente
- Você verá o progresso em **"Deployments"**

---

## 🆘 Troubleshooting

### Erro: "Connection refused"
- ✅ Verifique se MySQL está rodando
- ✅ Verifique se `bind-address = 0.0.0.0` está configurado
- ✅ Reinicie o MySQL

### Erro: "Connection timeout"
- ✅ Verifique se o Port Forwarding está configurado
- ✅ Verifique se seu firewall está bloqueando a porta 3306
- ✅ Verifique se seu IP externo está correto

### Erro: "Access denied for user"
- ✅ Verifique se o usuário e senha estão corretos
- ✅ Verifique se o usuário tem permissão para acesso remoto

### App funciona localmente mas não na Vercel
- ✅ Verifique a DATABASE_URL em Environment Variables
- ✅ Clique em **"Redeploy"** para aplicar mudanças
- ✅ Verifique os logs em **"Deployments"** → **"View logs"**

---

## ⚠️ Importante: Manter Máquina Ligada

Para que o app funcione na Vercel:
1. **Sua máquina PRECISA estar SEMPRE ligada**
2. **MySQL PRECISA estar rodando**
3. **Sua internet PRECISA estar estável**

Se sua máquina desligar, o app ficará indisponível!

---

## 🎉 Pronto!

Seu app está agora hospedado na Vercel com banco de dados MySQL local!

**URL do seu app:** `https://seu-projeto.vercel.app`

Qualquer dúvida, é só chamar! 🚀
