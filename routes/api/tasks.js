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

router.patch('/completetasks/many', async (req, res) => {
    await Task.updateMany({_id: {$in: req.body.tasks}}, {isCompleted: true})
    .catch(err => {
        console.log(err);
        res.sendStatus(400).json(err);
    });
    res.sendStatus(200);
})

router.patch('/complete/:taskId', async (req, res) => {
    await Task.findByIdAndUpdate(req.params.taskId, {isCompleted: true})
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
    const tasks = user.tasks;
    res.status(200).send(tasks);
})

router.delete('/category/:categoryName', async (req, res) => {
    const categoryName = req.params.categoryName;
    const userId = req.user._id;
    await Task.deleteMany({category: categoryName, isCompleted: false})
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