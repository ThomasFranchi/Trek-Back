const checkType = require("../lib/checkType");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// const mailRegExp = new RegExp("^[a-zA-Z0-9_!#$%&amp;'*+/=?`{|}~^-]+(?:\\.[a-zA-Z0-9_!#$%&amp;'*+/=?`{|}~^-]+)*@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$");
// const passwordRegExp = new RegExp("^(.*[a-zA-Z0-9!@#$%^&*]){1,16}$");

const loginCtrl = {
    async loginAdmin(req, res) {
        const { mail, password } = req.body;

        // Check if everything is good
        checkType(mail, password);

        try {
            const admin = await prisma.admins.findUnique({ where: { email: mail } });
            if (!admin) {
                return res.status(422).json({ message: "Une erreur inattendue est survenue" });
            }

            // Check if the decrypted password is correct
            const match = bcrypt.compareSync(password, admin.password);
            if (!match) {
                return res.status(422).json({ message: "L'adresse mail ou le mot de passe est incorrect" });
            }

            // Generate json web token
            const token = jwt.sign({ userId: admin.admin_id }, process.env.SECRET_KEY, { expiresIn: "24h" });
            return res.status(200).json({ success: true, message: "Connexion réussie", token: token, user: { mail: admin.email, role: admin.role } });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Une erreur inattendue est survenue" });
        }
    },

    async loginGuide(req, res) {
        const { mail, password } = req.body;

        // Check if everything is good
        checkType(mail, password);

        try {
            const guide = await prisma.guides.findUnique({ where: { email: mail } });
            if (!guide) {
                return res.status(422).json({ message: "Une erreur inattendue est survenue" });
            }

            // Check if the decrypted password is correct
            const match = bcrypt.compareSync(password, guide.password);
            if (!match) {
                return res.status(422).json({ message: "L'adresse mail ou le mot de passe est incorrect" });
            }

            // Generate json web token
            const token = jwt.sign({ userId: guide.guide_id }, process.env.SECRET_KEY, { expiresIn: "24h" });
            return res.status(200).json({ success: true, message: "Connexion réussie", token: token, user: { mail: guide.email, role: guide.role } });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Une erreur inattendue est survenue" });
        }
    },

    async loginUser(req, res) {
        const { mail, password } = req.body;

        // Check if everything is good
        checkType(mail, password);

        try {
            const user = await prisma.users.findUnique({ where: { email: mail } });
            if (!user) {
                return res.status(422).json({ message: "Une erreur inattendue est survenue" });
            }

            // Check if the decrypted password is correct
            const match = bcrypt.compareSync(password, user.password);
            if (!match) {
                return res.status(422).json({ message: "L'adresse mail ou le mot de passe est incorrect" });
            }

            // Generate json web token
            const token = jwt.sign({ userId: user.user_id }, process.env.SECRET_KEY, { expiresIn: "24h" });
            return res.status(200).json({ success: true, message: "Connexion réussie", token: token, user: { mail: user.email, role: user.role } });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Une erreur inattendue est survenue" });
        }
    },

    getCurrentUser(req, res) {
        res.json(req.user);
    },

    async getUserRole(req, res) {
        const id = req.user.userId;

        try {
            const admin = await prisma.admins.findUnique({ where: { admin_id: id } });
            const guide = await prisma.guides.findUnique({ where: { guide_id: id } });
            const user = await prisma.users.findUnique({ where: { user_id: id } });

            if (admin) {
                req.user = admin;
            } else if (guide) {
                req.user = guide;
            } else if (user) {
                req.user = user;
            } else {
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }

            return res.json(req.user);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Une erreur inattendue est survenue" });
        }
    }
};

module.exports = loginCtrl;
