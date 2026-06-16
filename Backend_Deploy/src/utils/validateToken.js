const jwt = require("jsonwebtoken");
require("dotenv").config();

const validateToken = async (request, response, next) => {
  try {
    const rawToken = request.header("Authorization");
    if (!rawToken || !rawToken.startsWith("Bearer")) {
      return response.status(401).json({ message: "Token mal formado" });
    }

    if (!process.env.SECRET_KEY) {
      console.error("SECRET_KEY no definida");
      return response.status(500).json({ message: "Error interno de autenticación" });
    }

    const token = rawToken.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    request.user = decoded;
    console.log("Usuario autenticado:", decoded); // solo en dev
    next();
  } catch (error) {
    return response.status(401).json({ message: "Token inválido o expirado" });
  }
};

module.exports = validateToken;
