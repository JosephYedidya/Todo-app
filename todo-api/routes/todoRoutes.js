const express = require("express");

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    message: "Les routes des tâches fonctionnent !"
  });
});

module.exports = router;