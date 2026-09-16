// api/webpay-commit.js
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

    const { token_ws } = req.query;

    if (!token_ws) {
        return res.status(400).json({ error: 'Falta el token de transacción' });
    }

    try {
        const response = await fetch(`https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions/${token_ws}`, {
            method: 'PUT',
            headers: {
                'Tbk-Api-Key-Id': '597020000540',
                'Tbk-Api-Key-Secret': '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json(); // Estado final de la transacción (Aprobado/Rechazado)
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};