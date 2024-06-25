const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const guidesCtrl = {
  // Get all the guides in the database
  async getGuidesList(req, res) {
    try {
      const list = await prisma.guides.findMany();
      if (!list) {
        return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
      }
      console.log(list);
      return res.json(list);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  },

  // Update a guide with all the new information
  async updateGuide(req, res) {
    const body = req.body;
    try {
      const guide = await prisma.guides.findUnique({ where: { slug: body.slug } });
      if (!guide) {
        return res.status(422).json({ message: "L'opération n'a pas pu être effectuée" });
      }

      let updatedData = {};
      if (body.firstName && body.lastName) {
        updatedData.firstname = body.firstName;
        updatedData.lastname = body.lastName;
        updatedData.slug = body.firstName.toLowerCase().replaceAll(" ", "-") + body.lastName.toLowerCase().replaceAll(" ", "-");
      } else {
        if (body.firstName) {
          updatedData.firstname = body.firstName;
          updatedData.slug = body.firstName.toLowerCase().replaceAll(" ", "-") + guide.lastname.toLowerCase().replaceAll(" ", "-");
        }
        if (body.lastName) {
          updatedData.lastname = body.lastName;
          updatedData.slug = guide.firstname.toLowerCase().replaceAll(" ", "-") + body.lastName.toLowerCase().replaceAll(" ", "-");
        }
      }

      if (body.mail) {
        updatedData.email = body.mail;
      }
      if (req.file) {
        updatedData.guide_picture = "/uploads/" + req.file.filename;
      }
      if (body.password) {
        updatedData.password = bcrypt.hashSync(body.password, 10);
      }
      if (body.description) {
        updatedData.description = body.description;
      }
      if (body.experienceYears) {
        updatedData.experience_years = body.experienceYears;
      }
      if (body.state) {
        updatedData.state = body.state;
      }

      const updatedGuide = await prisma.guides.update({
        where: { slug: body.slug },
        data: updatedData
      });

      return res.status(200).json({ status: 200, message: "Guide modifié", guide: updatedGuide });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  },

  // Delete a guide from the database
  async deleteGuide(req, res) {
    const { slug } = req.body;
    try {
      const guide = await prisma.guides.delete({ where: { slug: slug } });
      return res.status(200).json({ message: "Guide supprimé" });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  },

  // Get a single guide with its slug
  async getSingleGuide(req, res) {
    const slug = req.params.slug;
    try {
      const guide = await prisma.guides.findFirst({ where: { slug: slug } });
      if (!guide) {
        return res.status(422).json({ message: "L'opération n'a pas pu être effectuée" });
      }
      console.log("guide", guide);
      return res.json(guide);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  },

  // Get a single guide with its ObjectID
  async getSingleGuideById(req, res) {
    try {
      const guide = await prisma.guides.findUnique({ where: { guide_id: req.params.id } });
      if (!guide) {
        return res.status(422).json({ message: "L'opération n'a pas pu être effectuée" });
      }
      return res.json(guide);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  }
};

module.exports = guidesCtrl;
