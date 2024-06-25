const jwt = require("jsonwebtoken");
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function token(req, res, next) {
    const authHeader = req.get("Authorization");
    const token = authHeader && authHeader.split(" ")[1];

    // Verifying if token is valid
    if (!token) {
        return res.status(401).json({ message: "Aucun token trouvé" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

        // If token is not valid
        if (!decodedToken) {
            return res.status(401).json({ message: "Token invalide" });
        }

        // If valid, get access to user id
        const userId = decodedToken.userId;

        // Getting the user by id
        const admin = await prisma.admins.findUnique({ where: { admin_id: userId } });
        const guide = await prisma.guides.findUnique({ where: { guide_id: userId } });
        const user = await prisma.users.findUnique({ where: { user_id: userId } });

        // Verification of the user
        let currentUser;
        if (!admin && !guide && !user) {
            throw new Error("Aucun utilisateur trouvé");
        }
        if (admin) {
            currentUser = admin;
        }
        if (guide) {
            currentUser = guide;
        }
        if (user) {
            currentUser = user;
        }

        req.user = currentUser;
        next();
    } catch (error) {
        return res.status(400).json({ message: "Token invalide" });
    } finally {
        await prisma.$disconnect();
    }
}

module.exports = token;
