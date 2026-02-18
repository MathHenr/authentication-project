const User = require("../models/User");

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
      });
    } catch (e) {
      return res
        .status(400)
        .json({ error: `Falha ao registrar: ${e.message}` });
    }
  },
};
