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
    // captura do IP para modulo de segurança
    const userIp =
      req.ip || req.header["x-forwarded-for"] || req.socket.remoteAddress;

    try {
      const user = await User.findOne({ email }).select(
        "+password +loginAttempts +lockUntil +knowIps",
      );

      if (!user) {
        return res.status(400).json({ error: "Usuário nao encontrado" });
      }

      // verificando se o usuário esta bloqueado
      if (user.lockUntil && user.lockUntil > Date.now()) {
        return res.status(403).json({
          error: "Conta bloqueado temporariamente por excesso de tentativas",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        // incrementamos o numero de tentativas
        user.loginAttempts += 1;
        if (user.loginAttempts >= 5) {
          user.lockUntil = Date.now() + 1000 * 60; // bloqueamos o usuário por 1 min
        }
        await user.save();
        return res.status(400).json({ error: "Senha invalida." });
      }

      // vamos verificar se o IP e 'estranho'
      let warning = null;
      if (user.knowIps.length > 0 && !user.knowIps.includes[userIp]) {
        return res.status(403).json({
          warning:
            "Detectamos tentativa de acesso de um local diferente do normal.",
        });
      }

      // sucesso, vamos dar um reset as variáveis de segurança
      user.loginAttempts = 0;
      user.lockUntil = undefined;
      if (!user.knowIps.includes[userIp]) {
        user.knowIps.push(userIp);
      }

      await user.save();

      user.password = undefined;

      return res.status(200).json({
        message: "Login realizado com sucesso.",
        user,
        token: generateToken({ id: user.id }),
        warning,
      });
    } catch (e) {
      return res.status(500).json({ error: `Erro no servidor: ${e.message}` });
    }
  },
};
