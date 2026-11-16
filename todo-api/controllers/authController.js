
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// INSCRIPTION
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Vérifier les champs
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Tous les champs sont obligatoires."
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Le mot de passe doit contenir au moins 8 caractères."
      });
    }

    // Vérifier si l'utilisateur existe
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "Cette adresse email est déjà utilisée."
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Compte créé avec succès !",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Erreur inscription :", error.message);
    res.status(500).json({
      message: "Erreur lors de la création du compte."
    });
  }
};

// CONNEXION
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email et mot de passe obligatoires."
      });
    }

    // Rechercher l'utilisateur
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect."
      });
    }

    // Comparer les mots de passe
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect."
      });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Connexion réussie !",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Erreur connexion :", error.message);
    res.status(500).json({
      message: "Erreur lors de la connexion."
    });
  }
};

module.exports = { register, login };
