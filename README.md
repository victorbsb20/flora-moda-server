# Flora Moda - Servidor de Pagamentos PIX

## Como fazer deploy (hospedar grátis)

### Opção 1: Render.com (Recomendado - Mais fácil)

1. Acesse https://render.com e crie uma conta
2. Clique em "New" → "Web Service"
3. Conecte seu GitHub ou cole o link do repositório
4. Configure:
   - Name: flora-moda-server
   - Runtime: Node
   - Build Command: npm install
   - Start Command: npm start
5. Em "Environment Variables" adicione:
   - MP_ACCESS_TOKEN = APP_USR-6116263680994569-010114-17c72728334a5ec1d4f6392e8b116885-2711363613
6. Clique em "Create Web Service"
7. Aguarde o deploy (2-3 minutos)
8. Copie a URL gerada (ex: https://flora-moda-server.onrender.com)

### Opção 2: Railway.app

1. Acesse https://railway.app e crie uma conta
2. Clique em "New Project" → "Deploy from GitHub repo"
3. Selecione o repositório
4. Adicione a variável de ambiente MP_ACCESS_TOKEN
5. Deploy automático!

### Opção 3: Vercel

1. Acesse https://vercel.com
2. Importe o projeto do GitHub
3. Configure as variáveis de ambiente
4. Deploy!

---

## Depois de hospedar

Pegue a URL do seu servidor (ex: https://flora-moda-server.onrender.com)
e atualize no arquivo da loja (loja-flora-moda-corrigida.html)

Procure por: const API_URL = 
E coloque sua URL.

---

## Endpoints da API

- GET / → Verifica se está online
- POST /criar-pix → Cria um pagamento PIX
- GET /verificar-pagamento/:id → Verifica status do pagamento
