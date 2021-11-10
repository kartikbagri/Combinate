const express = require('express');
const Task = require('../../schema/taskSchema');
const User = require('../../schema/userSchema');

const router = express.Router();

router.patch('/category/new/:id', async (req, res) => {
    const categories = req.body;
    const userId = req.params.id;
    await User.findByIdAndUpdate(userId, {categories: categories})
    .catch(err => {
        console.log(err);
        res.sendStatus(400).json(err);
    });
    res.sendStatus(200);
})

router.patch('/task/new/:id', async (req, res) => {
    const taskId = req.body;
    const userId = req.params.id;
    await User.findByIdAndUpdate(userId, {$push: {tasks: taskId }})
    .catch(err => {
        console.log(err);
        res.sendStatus(400).json(err);
    });
    res.sendStatus(200);
});

router.post('/task/new/:id', async (req, res) => {
    const task = req.body;
    const newTask = new Task(task);
    const resTask = await newTask.save()
    .catch(err => {
        console.log(err);
        res.sendStatus(400).json(err);
    });
    res.status(200).send(resTask._id);
});

router.get('/:id', async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId)
    .populate('tasks')
    .catch(err => {
        console.log(err);
        res.sendStatus(400).json(err);
    });
    res.status(200).send(user);
})

router.delete('/category/:categoryName', async (req, res) => {
    const categoryName = req.params.categoryName;
    const userId = req.body.userId;
    await Task.deleteMany({category: categoryName})
    .catch(err => {
        console.log(err);
        res.sendStatus(400).json(err);
    });
    await User.findByIdAndUpdate(userId, {$pull: {categories: categoryName}})
    .catch(err => {
        console.log(err);
        res.sendStatus(400).json(err);
    });
    res.sendStatus(200);
})

module.exports = router;