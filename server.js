const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Payment } = require('mercadopago');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do Mercado Pago
const client = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN || 'APP_USR-81765187002129-121010-dd94b050dd63edccac8c6b56ca3afd92-2711363613'
});

const payment = new Payment(client);

// Middleware
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
    res.json({ 
        status: 'online',
        message: 'Servidor Flora Moda - API de Pagamentos PIX',
        endpoints: {
            criar_pix: 'POST /criar-pix',
            verificar_pagamento: 'GET /verificar-pagamento/:id'
        }
    });
});

// Criar pagamento PIX
app.post('/criar-pix', async (req, res) => {
    try {
        const { valor, cliente, descricao } = req.body;

        if (!valor || valor <= 0) {
            return res.status(400).json({ error: 'Valor inválido' });
        }

        const pagamentoData = {
            transaction_amount: parseFloat(valor),
            description: descricao || `Pedido Flora Moda - ${cliente || 'Cliente'}`,
            payment_method_id: 'pix',
            payer: {
                email: `${(cliente || 'cliente').toLowerCase().replace(/\s/g, '').replace(/[^a-z0-9]/g, '')}@cliente.floramoda.com`,
                first_name: cliente ? cliente.split(' ')[0] : 'Cliente',
                last_name: cliente ? cliente.split(' ').slice(1).join(' ') || 'Flora' : 'Flora'
            }
        };

        console.log('Criando pagamento:', pagamentoData);

        const resultado = await payment.create({ 
            body: pagamentoData,
            requestOptions: { idempotencyKey: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }
        });

        console.log('Pagamento criado:', resultado.id);

        // Retornar dados do PIX
        res.json({
            success: true,
            id: resultado.id,
            status: resultado.status,
            qr_code: resultado.point_of_interaction?.transaction_data?.qr_code,
            qr_code_base64: resultado.point_of_interaction?.transaction_data?.qr_code_base64,
            valor: resultado.transaction_amount
        });

    } catch (error) {
        console.error('Erro ao criar PIX:', error);
        res.status(500).json({ 
            error: 'Erro ao criar pagamento',
            message: error.message 
        });
    }
});

// Verificar status do pagamento
app.get('/verificar-pagamento/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await payment.get({ id: id });

        res.json({
            success: true,
            id: resultado.id,
            status: resultado.status,
            status_detail: resultado.status_detail,
            valor: resultado.transaction_amount,
            pago: resultado.status === 'approved'
        });

    } catch (error) {
        console.error('Erro ao verificar pagamento:', error);
        res.status(500).json({ 
            error: 'Erro ao verificar pagamento',
            message: error.message 
        });
    }
});

// Webhook do Mercado Pago (opcional - para notificações)
app.post('/webhook', (req, res) => {
    console.log('Webhook recebido:', req.body);
    res.status(200).send('OK');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║     🌸 FLORA MODA - Servidor PIX 🌸        ║
╠════════════════════════════════════════════╣
║  Servidor rodando na porta ${PORT}             ║
║  API Mercado Pago configurada ✓            ║
╚════════════════════════════════════════════╝
    `);
});
