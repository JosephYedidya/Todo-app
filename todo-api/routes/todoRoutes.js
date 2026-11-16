
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo
} = require("../controllers/todoController");

// Protéger toutes les routes avec JWT
router.use(protect);

// Créer une tâche
router.post("/", createTodo);

// Récupérer toutes les tâches
router.get("/", getTodos);

// Modifier une tâche
router.put("/:id", updateTodo);

// Supprimer une tâche
router.delete("/:id", deleteTodo);

module.exports = router;
