const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Route d'accueil
app.get("/", (req, res) => {
  res.json({
    message: "Bienvenue sur notre API To-Do List !",
    status: "success"
  });
});

// Routes de l'application
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});