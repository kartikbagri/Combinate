const express = require('express');
const axios = require('axios');

// ********** Using Modules **********
const router = express.Router();

router.get('/', async (req, res) => {
    const payload = { title: 'Overview' };
    const [quoteResult, contestsResult] = await Promise.allSettled([getQuote(), getContests(req.user)]);
    // Thought of the day section
    updateQuoteResult(payload, quoteResult);
    // Contests Section
    updateContestsResult(payload, contestsResult);
    res.render('overview', payload);
});

// getQuote() function
const getQuote = async () => {
    const res = await axios.get('https://zenquotes.io/api/random')
    .catch(err => {
        console.log(err);
        return null;
    });
    const currQuote = res.data[0];
    return currQuote;
}

// Update thought of the day section
const updateQuoteResult = (payload, quoteResult) => {
    if(quoteResult.status === 'fulfilled') {
        payload.quoteText = quoteResult.value.q;
        payload.quoteAuthor = quoteResult.value.a;
    } else {
        payload.quoteError = 'Unable to fetch Thought of the day';
    }
}

// getContests() Function 
const getContests = async (userLoggedIn) => {
    const codingSites = userLoggedIn.codingSites;
    const finalRes = [];
    for(const site of codingSites) {
        const res = await axios.get(`https://kontests.net/api/v1/${site}`)
        .catch(err => {
            console.log(err);
            return null;
        });
        finalRes.push(...res.data);
    }
    const today = new Date();
    const finalResult = finalRes.filter(a => {
        return (new Date(a.start_time) >= today);
    })
    finalResult.sort((a, b) => {
        const aNew = Date.parse(a.start_time.substring(0,23) + a.start_time.substring(26));
        const bNew = Date.parse(b.start_time.substring(0,23) + b.start_time.substring(26));
        return new Date(aNew).getTime() - new Date(bNew).getTime();
    });
    return finalResult;
}

const updateContestsResult = (payload, contestsResult) => {
    if(contestsResult?.status === 'fulfilled') {
        payload.contestsResult = contestsResult.value;
    } else {
        payload.contestsError = 'Unable to fetch contest details';
    }
}

module.exports = router;