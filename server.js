const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// 1. Разрешаем CORS, чтобы твой сайт на GitHub Pages мог делать запросы
app.use(cors());

// 2. Тот самый маршрут /proxy, который мы восстановили
app.get('/proxy', async (req, res) => {
    const streamUrl = req.query.url;

    if (!streamUrl) {
        return res.status(400).send('Ошибка: Не указан URL радиостанции');
    }

    try {
        console.log(`Проксируем поток: ${streamUrl}`);

        const response = await axios({
            method: 'get',
            url: streamUrl,
            responseType: 'stream',
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
            }
        });

        // Передаем заголовок типа контента (audio/mpeg и т.д.)
        res.setHeader('Content-Type', response.headers['content-type'] || 'audio/mpeg');
        
        // Пробрасываем аудио-поток прямо в браузер
        response.data.pipe(res);

    } catch (error) {
        console.error('Ошибка при проксировании:', error.message);
        res.status(500).send('Ошибка прокси-сервера при получении аудио');
    }
});

// 3. Настройка порта. 80 — стандарт для Dockhost
const PORT = 80;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`RadioBase Proxy запущен!`);
    console.log(`Порт: ${PORT}`);
    console.log(`Маршрут: /proxy`);
});