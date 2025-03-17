const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Guardamos los datos del usuario en la request
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado." });
    }
};

module.exports = authMiddleware;
