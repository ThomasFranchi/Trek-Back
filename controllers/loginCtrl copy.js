// require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const adminModel = require ("../models/adminsModel");
const guideModel = require ("../models/guidesModel");
const userModel = require ("../models/usersModel");

const mailRegExp = new RegExp("^[a-zA-Z0-9_!#$%&amp;'*+/=?`{|}~^-]+(?:\\.[a-zA-Z0-9_!#$%&amp;'*+/=?`{|}~^-]+)*@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$");
const passwordRegExp = new RegExp("^(.*[a-zA-Z0-9!@#$%^&*]){1,16}$");

const loginCtrl = 
{
    async loginAdmin (req, res) {
        const {mail, password} = req.body;

        // Check if evertyhing is good
        if (typeof(mail) !== "string" || typeof(password) !== "string") {
            return res.status(422).json({message: "Un ou plusieurs champs ne sont pas du bon type"});
        }
        if (mail === "" || password === "") {
            return res.status(422).json({message: "Un ou plusieurs champs sont vides"});
        }
        if (!mailRegExp.test(mail) ) {
            return res.status(422).json({message: "Adresse mail ou mot de passe incorrect"});
        }

        if (!passwordRegExp.test(password)) {
            console.log(passwordRegExp.test(password));
            return res.status(422).json({message: "Votre mot de passe doit comporter au moins 4 caractères avec 1 lettre, 1 chiffre et 1 caractère spécial"});
        }

        const admin = await adminModel.findOne( {mail: mail}, "password mail role").exec();
        if (!admin) {
            return res.status(422).json({message:"Une erreur inattendue est survenue"}); 
        }
        
        // Check if the decrypted password is correct
        const match = bcrypt.compareSync(password, admin.password);
        if (!match) {
            return res.status(422).json({message: "L'adresse mail ou le mot de passe est incorrect"}) 
        }

        // Generate json web token
        const token = jwt.sign( {userId: admin._id}, process.env.SECRET_KEY, { expiresIn: "24h" });
        return res.status(200).json({success:true, message: "Connexion réussie", token: token, user: {mail: admin.mail, role: admin.role}});
    },
    async loginGuide (req, res) {
        const {mail, password} = req.body;

        // Check if evertyhing is good
        if (typeof(mail) !== "string" || typeof(password) !== "string") {
            return res.status(422).json({message: "Un ou plusieurs champs ne sont pas du bon type"});
        }
        if (mail === "" || password === "") {
            return res.status(422).json({message: "Un ou plusieurs champs sont vides"});
        }
        if (!mailRegExp.test(mail) ) {
            return res.status(422).json({message: "Adresse mail ou mot de passe incorrect"});
        }

        if (!passwordRegExp.test(password)) {
            return res.status(422).json({message: "Votre mot de passe doit comporter au moins 4 caractères avec 1 lettre, 1 chiffre et 1 caractère spécial"});
        }

        const guide = await guideModel.findOne( {mail: mail}, "password mail role").exec();
        if (!guide) {
            return res.status(422).json({message:"Une erreur inattendue est survenue"}); 
        }
        
        // Check if the decrypted password is correct
        const match = bcrypt.compareSync(password, guide.password);
        if (!match) {
            return res.status(422).json({message: "L'adresse mail ou le mot de passe est incorrect"}) 
        }

        // Generate json web token
        const token = jwt.sign( {userId: guide._id}, process.env.SECRET_KEY, { expiresIn: "24h" });
        return res.status(200).json({success:true, message: "Connexion réussie", token: token, user: {mail: guide.mail, role: guide.role}});
    },
    async loginUser (req, res){
        const {mail, password} = req.body;

        // Check if evertyhing is good
        if (typeof(mail) !== "string" || typeof(password) !== "string") {
            return res.status(422).json({message: "Un ou plusieurs champs ne sont pas du bon type"});
        }
        if (mail === "" || password === "") {
            return res.status(422).json({message: "Un ou plusieurs champs sont vides"});
        }
        if (!mailRegExp.test(mail) ) {
            return res.status(422).json({message: "Adresse mail ou mot de passe incorrect"});
        }

        // if (!passwordRegExp.test(password)) {
        //     return res.status(422).json({message: "Votre mot de passe doit comporter au moins 4 caractères avec 1 lettre, 1 chiffre et 1 caractère spécial"});
        // }
        
        const user = await userModel.findOne( {mail: mail}, "password mail role").exec();
        if (!user) {
            return res.status(422).json({message:"Une erreur inattendue est survenue"}); 
        }
        
        // Check if the decrypted password is correct
        const match = bcrypt.compareSync(password, user.password);
        if (!match) {
            return res.status(422).json({message: "L'adresse mail ou le mot de passe est incorrect"}) 
        }



        
        // Generate json web token
        const token = jwt.sign( {userId: user._id}, process.env.SECRET_KEY, { expiresIn: "24h" });
        return res.status(200).json({success:true, message: "Connexion réussie", token: token, user: {mail: user.mail, role: user.role}});
    },
    getCurrentUser(req, res)
    {
        res.json(req.user);
    },
    async getUserRole(req, res) {
        const id = req.user;
        const admin = adminModel.findOne( {_id: id} );
        const guide = guideModel.findOne( {_id: id} );
        const user = userModel.findOne( {_id: id} );

        if (admin || guide || user) {
            if (admin) {
                let user = admin;
                req.user = user;
            } 
            if (guide) {
                let user = guide;
                req.user = user;
            } 
            if (user) {
                let user = admin;
                req.user = user;
            } 
        }
        return res.json(req.user);
    }
}
module.exports = loginCtrl;