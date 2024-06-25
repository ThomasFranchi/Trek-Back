const jwt = require("jsonwebtoken");

const adminModel = require("../models/adminsModel");
const guideModel = require("../models/guidesModel");
const userModel = require("../models/usersModel");

async function token(req, res, next) {
    const token = String(req.get("Authorization")).split(" ")[1];

    //Verifing if token is valid
    if (!token) {
        return res.status(401).json({ message: "Aucun token trouvé" });
    }

    try {
        let currentUser;
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

        // if token is not valid
        if (!decodedToken) {
            return res.status(401).json({ message: "Token invalide" });
        }

        //if valid, get acess to user id
        const userId = decodedToken.userId;

        //Getting the user id
        const admin = await adminModel.findById(userId);
        const guide = await guideModel.findById(userId);
        const user = await userModel.findById(userId);
        // Verification du user
        if (!admin && !guide && !user) {
            throw new Error("Aucun utilisateur trouvé");
        }
        if (admin || guide || user) {
            if (admin) {
                currentUser = admin;
            }
            if (guide) {
                currentUser = guide;
            }
            if (user) {
                currentUser = user;
            }
        }
        req.user = currentUser;
        next();
    }
    catch (error) {
        return res.status(400).json({ message: "Token invalide" });
    }
}
module.exports = token;  