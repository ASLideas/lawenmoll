// api/webpay-create.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    // Permisos de seguridad y acceso (CORS)
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

    const { amount, email, returnUrl } = req.body;
    const buyOrder = "LAWEN-" + Math.floor(100000 + Math.random() * 900000);
    const sessionId = "SESS-" + Math.floor(100000 + Math.random() * 900000);

    try {
        const response = await fetch('https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions', {
            method: 'POST',
            headers: {
                'Tbk-Api-Key-Id': '597020000540', // Código de comercio de prueba oficial
                'Tbk-Api-Key-Secret': '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C', // Llave de prueba oficial
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                buy_order: buyOrder,
                session_id: sessionId,
                amount: amount,
                return_url: returnUrl
            })
        });

        const data = await response.json(); // Devuelve el token y la URL segura de Transbank
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};