const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors()); // Разрешаем доступ с твоего GitHub сайта

app.get('/proxy', async (req, res) => {
    const streamUrl = req.query.url;
    if (!streamUrl) return res.status(400).send('URL не указан');

    try {
        const response = await axios({
            method: 'get',
            url: streamUrl,
            responseType: 'stream',
            timeout: 10000 // Ждем ответ от радиостанции 10 секунд
        });
        
        // Устанавливаем правильный тип контента для аудио
        res.setHeader('Content-Type', response.headers['content-type'] || 'audio/mpeg');
        response.data.pipe(res);
    } catch (error) {
        console.error('Ошибка прокси:', error.message);
        res.status(500).send('Ошибка при получении потока');
    }
});

// ПОРТ 80 — критически важно для настроек Dockhost
const PORT = 80;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Прокси запущен на порту ${PORT}`);
});