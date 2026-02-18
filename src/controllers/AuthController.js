const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function generateToken(param = {}) {
  return jwt.sign(param, process.env.APP_SECRET, {
    expiresIn: 86400,
  });
}

module.exports = {
  async register(req, res) {
    const { name, email, password } = req.body;

    try {
      if (await User.findOne({ email })) {
        return res.status(400).json({ error: "Usuário ja existe" });
      }

      // captura do IP para modulo de segurança
      const userIp =
        req.ip || req.header["x-forwarded-for"] || req.socket.remoteAddress;

      // criação do usuário
      const user = await User.create({
        name,
        email,
        password,
        lastIp: userIp,
      });

      user.password = undefined;

      return res.status(201).json({
        message: "Usuário cadastrado!",
        user,
        agent: req.headers["user-agent"],
        token: generateToken({ id: user.id }),
      });
    } catch (e) {
      return res
        .status(500)
        .json({ error: `Falha ao registrar: ${e.message}` });
    }
  },

  // LOGIN
  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return res.status(400).json({ error: "Usuário nao encontrado" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ error: "Senha invalida." });
      }

      user.password = undefined;

      return res.status(200).json({
        message: "Login realizado com sucesso.",
        user,
        token: generateToken({ id: user.id }),
      });
    } catch (e) {
      return res.status(500).json({ error: `Erro no servidor: ${e.message}` });
    }
  },
};
