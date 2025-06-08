const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "chave_super_secreta";

function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Espera "Bearer token"

  if (!token) return res.status(401).json({ erro: "Token não fornecido." });

  jwt.verify(token, secret, (err, usuario) => {
    if (err) return res.status(403).json({ erro: "Token inválido." });

    req.usuario = usuario; // anexa os dados do usuário ao req
    next();
  });
}

module.exports = autenticarToken;
