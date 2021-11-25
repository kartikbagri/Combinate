const axios = require('axios');
const express = require('express');

// ********** Using Modules **********
const router = express.Router();

router.get('/:id', async (req, res) => {
    const userLoggedIn = req.user;
    const user = await axios.get(`http://localhost:3000/api/users/user/${req.params.id}`);
    const payload = {title: `Profile`, user: user.data, userLoggedIn};
    res.render('userProfile', payload);
});

module.exports = router;