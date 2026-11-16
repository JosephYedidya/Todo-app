
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error('MONGODB_URI est introuvable dans le fichier .env');
    }

    await mongoose.connect(uri);

    console.log('MongoDB connecté avec succès !');
  } catch (error) {
    console.error('Erreur de connexion MongoDB :', error.message);
    throw error;
  }
};

module.exports = connectDB;
