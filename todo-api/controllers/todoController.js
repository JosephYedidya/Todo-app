
const Todo = require("../models/Todo");

// Créer une tâche
const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Le titre est obligatoire."
      });
    }

    const todo = await Todo.create({
      title,
      description,
      user: req.user.id
    });

    res.status(201).json({
      message: "Tâche créée avec succès !",
      todo
    });

  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création de la tâche.",
      error: error.message
    });
  }
};

// Récupérer les tâches
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: todos.length,
      todos
    });

  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des tâches."
    });
  }
};

// Modifier une tâche
const updateTodo = async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const updates = {};

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (completed !== undefined) updates.completed = completed;

    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updates,
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({
        message: "Tâche introuvable."
      });
    }

    res.status(200).json({
      message: "Tâche modifiée avec succès !",
      todo
    });

  } catch (error) {
    res.status(400).json({
      message: "Impossible de modifier cette tâche."
    });
  }
};

// Supprimer une tâche
const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!todo) {
      return res.status(404).json({
        message: "Tâche introuvable."
      });
    }

    res.status(200).json({
      message: "Tâche supprimée avec succès !"
    });

  } catch (error) {
    res.status(400).json({
      message: "Impossible de supprimer cette tâche."
    });
  }
};

module.exports = {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo
};
