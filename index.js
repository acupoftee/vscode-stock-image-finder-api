const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT;

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
    }
})

app.listen(port, () => console.log(`App listening on port ${port}`))