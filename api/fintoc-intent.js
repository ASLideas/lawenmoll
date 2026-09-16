// api/fintoc-intent.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    // Habilitar la seguridad y permisos (CORS)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const { amount, email } = req.body;

    try {
        const response = await fetch('https://api.fintoc.com/v1/payment_intents', {
            method: 'POST',
            headers: {
                'Authorization': process.env.FINTOC_SECRET_KEY, // sk_test_... configurada en Vercel
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: amount, // Monto en CLP
                currency: 'CLP',
                recipient_account: {
                    holder_id: '76123456-K', // RUT de LAWENMOLL SpA
                    number: '1234567890',   // Cuenta Bancaria para recibir abonos
                    type: 'checking',       // Cuenta Corriente
                    institution_id: 'cl_banco_de_chile' // Banco receptor
                },
                metadata: { email: email }
            })
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};