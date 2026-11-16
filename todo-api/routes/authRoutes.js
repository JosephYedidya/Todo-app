const express = require("express");

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    message: "Les routes d'authentification fonctionnent !"
  });
});

module.exports = router;