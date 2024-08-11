const express = require('express');
const Todo = require('../models/Todo');
const router = express.Router();

// Get all todos
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching todos', error: err.message });
    }
});

// Add a new todo
router.post('/', async (req, res) => {
    const { title, description, deadline } = req.body;

    if (!title || !description || !deadline) {
        return res.status(400).json({ message: 'Title, description, and deadline are required' });
    }

    const todo = new Todo({
        title,
        description,
        deadline,
        status: 'inactive' // Default status
    });

    try {
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(400).json({ message: 'Error creating todo', error: err.message });
    }
});

// Update a todo
router.put('/:id', async (req, res) => {
    const { title, description, status, deadline } = req.body;

    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ message: 'Todo not found' });

        // Update fields only if provided
        todo.title = title !== undefined ? title : todo.title;
        todo.description = description !== undefined ? description : todo.description;
        todo.status = status !== undefined ? status : todo.status;
        todo.deadline = deadline !== undefined ? deadline : todo.deadline;

        // Check if the deadline has passed and update status accordingly
        if (todo.deadline && new Date() > new Date(todo.deadline)) {
            todo.status = 'expired';
        }

        const updatedTodo = await todo.save();
        res.json(updatedTodo);
    } catch (err) {
        res.status(400).json({ message: 'Error updating todo', error: err.message });
    }
});

// Delete a todo
router.delete('/:id', async (req, res) => {
    try {
        const result = await Todo.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: 'Todo not found' });
        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting todo', error: err.message });
    }
});

module.exports = router;
