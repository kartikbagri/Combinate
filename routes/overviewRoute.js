const express = require('express');
const axios = require('axios');

// ********** Using Modules **********
const router = express.Router();

router.get('/', async function(req, res) {
    const payload = {
        title: 'Overview'
    };
    const result = await getQuote();
    if(result) {
        payload.quoteText = result.q;
        payload.quoteAuthor = result.a;
    } else {
        payload.quoteError = 'Unable to fetch Thought of the day';
    }
    res.render('overview', payload);
});

async function getQuote() {
    const res = await axios.get('https://zenquotes.io/api/random')
    .catch(err => {
        console.log(err);
        return null;
    });
    const currQuote = res.data[0];
    return currQuote;
}

module.exports = router;