const express = require('express');
const User = require('../../schema/userSchema');

// ********** Using Modules **********
const router = express.Router();

router.get('/user/:id', async (req, res) => {
    const user = await User.findById(req.params.id)
    .catch(err => {
        res.status(400).send(err);
    })
    res.status(200).json(user);
});

router.get('/:id/following', async (req, res) => {
    const user = await User.findById(req.params.id)
    .populate('following')
    .catch(err => {
        res.status(400).send(err);
    })
    res.status(200).json(user.following);
});

router.get('/all', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.json(err);
    }
});

router.patch('/follow', async (req, res) => {
    const data = req.body;
    if(data.isFollowing) {
        try {
            await User.findByIdAndUpdate(data.userId, { $pull: { following: data.targetUserId }});
            await User.findByIdAndUpdate(data.targetUserId, { $pull: { followers: data.userId }});
            res.sendStatus(200);
        } catch (err) {
            res.status(400).json(err);
        }
    } else {
        try {
            await User.findByIdAndUpdate(data.userId, { $push: { following: data.targetUserId }});
            await User.findByIdAndUpdate(data.targetUserId, { $push: { followers: data.userId }});
            res.sendStatus(200);
        } catch (err) {
            res.status(400).json(err);
        }
    }
});

router.get('/search/', async (req, res) => {
    try {
        const users = await User.find({ $or: [{username: { $regex: req.query.q, $options: 'i' }}, {name: { $regex: req.query.q, $options: 'i' }}]});
        res.json(users);
    } catch (err) {
        res.json(err);
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