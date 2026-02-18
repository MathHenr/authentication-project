require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db.js");

const app = express();

connectDB();

const PORT = process.env.PORT || 3000;

// Rota de teste
app.get("/", (req, res) => {
  // res.send("Get da homepage");
  res.json({
    message: "Uma mensagem",
    status: "OK",
    timestamp: new Date(),
  });
});

app.listen(PORT, () => {
  console.log(`Servidor na porta: ${PORT}`);
  console.log(`Local do servidor: http://localhost:${PORT}`);
});
