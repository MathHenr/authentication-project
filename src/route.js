const express = require("express");
const AuthController = require("./controllers/AuthController");
const authMiddleware = require("./middlewares/auth");

const routes = express.Router();

routes.post("/register", AuthController.register);
routes.post("/login", AuthController.login);

// precisam de token
routes.use(authMiddleware);

routes.get("/me", (req, res) => {
  return res.status(200).json({ message: `Seja bem vindo ${req.userId}` });
});

module.exports = routes;
