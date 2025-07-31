const express = require('express');
const axios = require('axios');
const RateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT;

// Limit to 20 requests per minute
const ratelimiter = RateLimit({
    windowMs: 1 * 60 * 1000,
    max: 20,
});

app.use(ratelimiter);

app.get('/photos', async (req, res) => {
    const query = req.query.query;
    const page = req.query.query
    if (!query) {
       return res.status(400).json({ error: 'Missing required search query'});
    };

    try {
        const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: { query, page: page || 1 },
            headers: { 'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
        });
        res.send({ data: response.data });
    } catch (e) {
        console.error(e);
    };
})

app.listen(port, () => console.log(`App listening on port ${port}`))