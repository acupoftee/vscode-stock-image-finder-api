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
app.use(express.json())

app.get('/photos', async (req, res) => {
    const RESULTS_PER_PAGE = 30;
    const query = req.query.query;
    const page = req.query.page || 1; // default to first page
    if (!query) {
       return res.status(400).json({ error: 'Missing required search query'});
    };

    try {
        const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: { query, page: page, per_page: RESULTS_PER_PAGE },
            headers: { 'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
        });
        res.send({ data: response.data });
    } catch (e) {
        console.error(e);
    };
})

app.post('/download', async (req, res) => {
    const url = req.body.url.toString();
    try {
        const response = await axios.get(url, {
            headers: { 'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
        });
        res.send({ data: response.data })
    } catch (e) {
        console.error(e);
    }
})

app.listen(port, () => console.log(`App listening on port ${port}`))
