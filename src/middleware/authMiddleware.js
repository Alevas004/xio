// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const token = authHeader.split(" ")[1]; // Quita el 'Bearer'
    const decoded = jwt.verify(token, process.env.AUTH_SECRET); // Verifica token

    // Manejar diferentes estructuras de token
    const userId = decoded.user?.id || decoded.userId || decoded.id;

    const user = await User.findByPk(userId); // Busca usuario por ID del token
    if (!user)
      return res.status(401).json({ error: "User not found AUTH MIDDLEWARE" });

    req.user = user; // Lo adjunta para que esté disponible en la ruta
    next(); // Pasa al siguiente middleware o controlador
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = protect;
