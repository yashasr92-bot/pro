const express = require("express");
const router = express.Router();

let messages = [];

router.post("/", (req, res) => {
  messages.push(req.body);
  res.json({ message: "Sent" });
});

router.get("/", (req, res) => {
  res.json(messages);
});

module.exports = router;