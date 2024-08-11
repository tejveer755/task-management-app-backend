const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['inactive','in-progress', 'completed', 'expired'], default: 'inactive' },
    deadline: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

todoSchema.pre('save', function(next) {
    if (new Date() > this.deadline) {
        this.status = 'expired';
    }
    next();
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
