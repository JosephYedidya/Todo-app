
const mongoose = require("mongoose");
const Todo = require("../models/Todo");

const priorities = ["low", "medium", "high"];

// Valider et normaliser une date limite
const parseDueDate = (value) => {
  if (value === null || value === "") {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date;
};

// Créer une tâche
const createTodo = async (req, res) => {
  try {
    const {
      title,
      description = "",
      priority = "medium",
      dueDate = null
    } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Le titre est obligatoire."
      });
    }

    if (typeof description !== "string") {
      return res.status(400).json({
        message: "La description doit être du texte."
      });
    }

    if (!priorities.includes(priority)) {
      return res.status(400).json({
        message: "Priorité invalide. Choisissez low, medium ou high."
      });
    }

    const parsedDueDate = parseDueDate(dueDate);

    if (parsedDueDate === undefined) {
      return res.status(400).json({
        message: "La date limite est invalide."
      });
    }

    const todo = await Todo.create({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: parsedDueDate,
      user: req.user.id
    });

    return res.status(201).json({
      message: "Tâche créée avec succès !",
      todo
    });

  } catch (error) {
    console.error("Erreur createTodo :", error);

    return res.status(500).json({
      message: "Erreur lors de la création de la tâche."
    });
  }
};

// Récupérer les tâches de l'utilisateur connecté
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      count: todos.length,
      todos
    });

  } catch (error) {
    console.error("Erreur getTodos :", error);

    return res.status(500).json({
      message: "Erreur lors de la récupération des tâches."
    });
  }
};

// Modifier une tâche
const updateTodo = async (req, res) => {
  try {
    const { title, description, completed, priority, dueDate } = req.body;
    const updates = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          message: "Le titre ne peut pas être vide."
        });
      }

      updates.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== "string") {
        return res.status(400).json({
          message: "La description doit être du texte."
        });
      }

      updates.description = description.trim();
    }

    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        return res.status(400).json({
          message: "Le statut de la tâche est invalide."
        });
      }

      updates.completed = completed;
    }

    if (priority !== undefined) {
      if (!priorities.includes(priority)) {
        return res.status(400).json({
          message: "Priorité invalide. Choisissez low, medium ou high."
        });
      }

      updates.priority = priority;
    }

    if (dueDate !== undefined) {
      const parsedDueDate = parseDueDate(dueDate);

      if (parsedDueDate === undefined) {
        return res.status(400).json({
          message: "La date limite est invalide."
        });
      }

      updates.dueDate = parsedDueDate;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Aucune modification fournie."
      });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Identifiant de tâche invalide."
      });
    }

    const todo = await Todo.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!todo) {
      return res.status(404).json({
        message: "Tâche introuvable."
      });
    }

    return res.status(200).json({
      message: "Tâche modifiée avec succès !",
      todo
    });

  } catch (error) {
    console.error("Erreur updateTodo :", error);

    return res.status(400).json({
      message: "Impossible de modifier cette tâche."
    });
  }
};

// Supprimer une tâche
const deleteTodo = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Identifiant de tâche invalide."
      });
    }

    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!todo) {
      return res.status(404).json({
        message: "Tâche introuvable."
      });
    }

    return res.status(200).json({
      message: "Tâche supprimée avec succès !"
    });

  } catch (error) {
    console.error("Erreur deleteTodo :", error);

    return res.status(500).json({
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
