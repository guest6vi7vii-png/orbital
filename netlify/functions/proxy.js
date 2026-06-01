// netlify/functions/proxy.js — Proxy buat jalan di Netlify (serverless)
const axios = require('axios');

exports.handler = async (event, context) => {
    const { path, httpMethod, body } = event;
    const pathParts = path.split('/');
    const endpoint = pathParts[pathParts.length - 1];

    // CORS preflight
    if (httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST'
            },
            body: ''
        };
    }

    try {
        // **1. Terima token**
        if (endpoint === 'token' && httpMethod === 'POST') {
            const tokenData = JSON.parse(body);
            console.log('📩 Token:', JSON.stringify(tokenData).slice(0, 100));
            
            // Forward ke Firebase DB
            const firebaseUrl = 'https://project-lo-default-rtdb.firebaseio.com/tokens.json';
            await axios.post(firebaseUrl, tokenData);
            
            return {
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ status: 'token disimpan' })
            };
        }

        // **2. Ambil semua token**
        if (endpoint === 'tokens' && httpMethod === 'GET') {
            const firebaseUrl = 'https://project-lo-default-rtdb.firebaseio.com/tokens.json';
            const response = await axios.get(firebaseUrl);
            
            return {
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify(response.data)
            };
        }

        // **3. Kirim spam notif**
        if (endpoint === 'send-notif' && httpMethod === 'POST') {
            const payload = JSON.parse(body);
            // ... logika kirim ke FCM (sama kayak di atas)
            
            return {
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ status: 'notif terkirim (demo)' })
            };
        }

        // Health check
        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ status: 'GeminiXD Proxy Aktif 🔥' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: error.message })
        };
    }
};
