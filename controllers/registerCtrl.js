const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const checkType = require("../lib/checkType");
const mwUploadImage = require("../middlewares/uploadImageMw");

const prisma = new PrismaClient();

const registerCtrl = {
  async registerAdmin(req, res) {
    const { mail, password } = req.body;

    // Check if everything is good (typeof, unemptiness, regexp validation)
    checkType(mail, password);

    // Encrypt password to database
    const hashedPwd = bcrypt.hashSync(password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({ message: "Erreur inconnue" });
      }
      return hash;
    });

    let adminSlug = mail.toLowerCase().replaceAll("@", "").replaceAll(".", "");

    try {
      // Save admin to the admins database
      const newAdmin = await prisma.admins.create({
        data: {
          email: mail,
          password: hashedPwd,
          role: "admin",
          slug: adminSlug,
          created_at: new Date()
        }
      });

      return res.status(201).json({ message: "Compte crée", admin: newAdmin });
    } catch (err) {
      console.log(err);
      return res.status(422).json({ message: "Une erreur inattendue est survenue" });
    }
  },

  async registerGuide(req, res) {
    const { firstName, lastName, mail, password, description, experienceYears } = req.body;

    checkType(mail, password, firstName, lastName, description);

    // Encrypt password to database
    const hashedPwd = bcrypt.hashSync(password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({ message: "Erreur inconnue" });
      }
      return hash;
    });

    let guideSlug = firstName + lastName;
    guideSlug = guideSlug.toLowerCase().replaceAll(" ", "-");

    let imgPath = "/uploads/" + req.file.filename;

    try {
      // Save guide to the guides database
      const newGuide = await prisma.guides.create({
        data: {
          firstname: firstName,
          lastname: lastName,
          email: mail,
          password: hashedPwd,
          description: description,
          experience_years: Number(experienceYears),
          guide_picture: imgPath,
          role: "guide",
          slug: guideSlug,
          created_at: new Date()
        }
      });

      return res.status(201).json({ message: "Compte crée", guide: newGuide });
    } catch (err) {
      console.log(err);
      return res.status(422).json({ message: "Une erreur inattendue est survenue" });
    }
  },

  async registerUser(req, res) {
    const { firstName, lastName, mail, password } = req.body;

    checkType(mail, password, firstName, lastName);

    // Encrypt password to database
    const hashedPwd = bcrypt.hashSync(password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({ message: "Erreur inconnue" });
      }
      return hash;
    });

    let userSlug = firstName + lastName;
    userSlug = userSlug.toLowerCase().replaceAll(" ", "-");

    let imgPath;
    if (req.file) {
      imgPath = "/uploads/" + req.file.filename;
    } else {
      imgPath = "/uploads/dummy.png";
    }

    try {
      // Save user to the users database
      const newUser = await prisma.users.create({
        data: {
          firstname: firstName,
          lastname: lastName,
          email: mail,
          password: hashedPwd,
          client_picture: imgPath,
          role: "user",
          slug: userSlug,
          created_at: new Date()
        }
      });

      return res.status(201).json({ message: "Compte crée", user: newUser });
    } catch (err) {
      console.log(err);
      return res.status(422).json({ message: "Une erreur inattendue est survenue" });
    }
  }
};

module.exports = registerCtrl;
