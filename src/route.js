const express = require("express");
const AuthController = require("./controllers/AuthController");

const routes = express.Router();

routes.post("/register", AuthController.register);

module.exports = routes;
