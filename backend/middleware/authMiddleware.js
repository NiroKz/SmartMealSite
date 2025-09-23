const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "chave_super_secreta";

function autenticarToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Espera "Bearer token"

    if (!token) return res.status(401).json({ erro: "Token não fornecido." });

    const usuario = jwt.verify(token, secret); // síncrono com try/catch
    req.usuario = usuario; // agora contém id_user
    next();
  } catch (err) {
    return res.status(403).json({ erro: "Token inválido." });
  }
}

module.exports = autenticarToken;
