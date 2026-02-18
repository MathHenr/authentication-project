const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // caso auth header nao vir na requisição
  if (!authHeader) {
    return res
      .status(401)
      .json({ error: "Token nao fornecido pelo auth header." });
  }

  // verificando o formato 'Bearer <token>'
  const format = authHeader.split(" ");

  const [scheme, token] = format;

  if (!format.length === 2) {
    return res.status(401).json({ error: "Formato Bearer errado" });
  }

  // validando token
  jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
    if (err)
      return res.status(401).json({ error: "Token invalido ou expirado." });

    req.userId = decoded.id;

    return next();
  });
};
