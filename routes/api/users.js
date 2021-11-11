const express = require('express');
const User = require('../../schema/userSchema');

// ********** Using Modules **********
const router = express.Router();

router.get('/all', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.json({ message: err });
    }
})

router.patch('/codingSites/:id', async (req, res) => {
    const userId = req.params.id;
    await User.findByIdAndUpdate(userId, {codingSites: req.body.codingSites})
    .catch(err => {
        console.log(err);
        res.sendStatus(400);
    })
    res.sendStatus(200);
});

router.patch('/:id', async (req, res) => {
    const userId = req.params.id;
    await User.findByIdAndUpdate(userId, req.body)
    .catch(err => {
        console.log(err);
        res.sendStatus(400);
    })
    res.sendStatus(200);
})

module.exports = router;