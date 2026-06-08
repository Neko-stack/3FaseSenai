import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "";

const token = jwt.sign(
    {
        userId: 1,
        email: "usuario@exemplo.com",
        role: "admin"
    },
    SECRET_KEY,
    {
        expiresIn: "5s",
    }
);

setTimeout(() => {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log("Decodificado:", decoded);
    } catch (error) {
        console.error("Token invalido:", error.message);
    }
}, 5500)

console.log("JWT:", token);

