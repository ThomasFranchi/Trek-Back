const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const parcoursCtrl = {
  // Get all parcours in database
  async getParcoursList(req, res) {
    try {
      const list = await prisma.parcours.findMany();
      console.log(list);
      if (!list) {
        return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
      }
      return res.json(list);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  },

  // Create a parcours in the database
  async createParcours(req, res) {
    const { name, duration, description, price, difficulty, country } = req.body;
    console.log(req.body)
    // Check if everything is good (typeof, unemptiness, regexp validation)
    if (typeof name !== "string" || typeof description !== "string" || typeof country !== "string") {
      return res.status(422).json({ message: "Un ou plusieurs champs ne sont pas du bon type" });
    }
    if (name === "" || description === "" || country === "") {
      return res.status(422).json({ message: "Un ou plusieurs champs sont vides" });
    }

    let parcoursSlug = name.toLowerCase().replaceAll(" ", "-");

    let imgPath = "/uploads/" + req.file.filename;

    try {
      // Save new parcours to the parcours database
      const newParcours = await prisma.parcours.create({
        data: {
          name: name,
          duration: Number(duration),
          description: description,
          price:  Number(price),
          slug: parcoursSlug,
          parcours_picture: imgPath,
          difficulty: Number(difficulty),
          country: country
        }
      });
      return res.status(201).json({ message: "Parcours créé", parcours: newParcours });
    } catch (error) {
      console.error(error);
      return res.status(422).json({ message: "Une erreur inattendue est survenue" });
    }
  },

  // Update a parcours according to the new information
  async updateParcours(req, res) {
    const body = req.body;

    try {
      const parcours = await prisma.parcours.findUnique({ where: { slug: body.slug } });
      if (!parcours) {
        return res.status(422).json({ message: "L'opération n'a pas pu être effectuée" });
      }

      let updatedData = {};
      if (body.name) {
        updatedData.name = body.name;
        updatedData.slug = body.name.toLowerCase().replaceAll(" ", "-");
      }
      if (req.file) {
        updatedData.parcours_picture = "/uploads/" + req.file.filename;
      }
      if (body.duration) {
        updatedData.duration = body.duration;
      }
      if (body.description) {
        updatedData.description = body.description;
      }
      if (body.price) {
        updatedData.price = body.price;
      }
      if (body.difficulty) {
        updatedData.difficulty = body.difficulty;
      }
      if (body.country) {
        updatedData.country = body.country;
      }

      const updatedParcours = await prisma.parcours.update({
        where: { slug: body.slug },
        data: updatedData
      });
      return res.status(200).json({ status: 200, message: "Parcours modifié", parcours: updatedParcours });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  },

  // Delete a parcours
  async deleteParcours(req, res) {
    const { slug } = req.body;

    try {
      const parcours = await prisma.parcours.delete({ where: { slug: slug } });
      return res.status(200).json({ message: "Parcours supprimé" });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  },

  // Create a step in the parcours
  async createStep(req, res) {
    let stepSlug = req.body.stepName.toLowerCase().replaceAll(" ", "-");
    let imgPath = "/uploads/" + req.file.filename;
    
    try {
      const newStep = await prisma.steps.create({

        data: {
          step_name: req.body.stepName,
          step_latitude: req.body.stepLatitude,
          step_longitude: req.body.stepLongitude,
          step_picture: imgPath,
          step_description: req.body.stepDescription,
          step_slug: stepSlug,
          parcours_id: req.body.parcours_id
        }
      });
      return res.status(200).json({ message: "Étape ajoutée", step: newStep });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  },

  // Update a step in the parcours
  async updateStep(req, res) {
    const body = req.body;

    try {
      const step = await prisma.steps.findFirst({ where: { step_slug: body.stepSlug } });
      if (!step) {
        return res.status(422).json({ message: "L'opération n'a pas pu être effectuée" });
      }

      let updatedData = {};
      if (body.name) {
        updatedData.step_name = body.name;
        updatedData.step_slug = body.name.toLowerCase().replaceAll(" ", "-");
      }
      if (req.file) {
        updatedData.step_picture = "/uploads/" + req.file.filename;
      }
      if (body.latitude) {
        updatedData.step_latitude = body.latitude;
      }
      if (body.longitude) {
        updatedData.step_longitude = body.longitude;
      }
      if (body.description) {
        updatedData.step_description = body.description;
      }

      const updatedStep = await prisma.steps.update({
        where: { step_slug: body.stepSlug },
        data: updatedData
      });

      return res.status(200).json({ status: 200, message: "Étape modifiée", step: updatedStep });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  },

  // Delete a step in the parcours
  async deleteStep(req, res) {
    const { slug, stepSlug } = req.body;

    try {
      const step = await prisma.steps.delete({
        where: { step_slug: stepSlug }
      });
      return res.status(200).json({ message: "Étape supprimée" });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  },

  // Get a single parcours, according to its slug
  async getSingleParcours(req, res) {
    const slug = req.params.slug;
    try {
      const parcours = await prisma.parcours.findFirst({ where: { slug: slug } });
      if (!parcours) {
        return res.status(422).json({ message: "L'opération n'a pas pu être effectuée" });
      }
      return res.json(parcours);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  },

  // Get a single parcours, according to its id
  async getSingleParcoursById(req, res) {
    try {
      const parcours = await prisma.parcours.findUnique({
        where: { parcours_id:req.params.id }
      });
      if (!parcours) {
        return res.status(422).json({ message: "L'opération n'a pas pu être effectuée" });
      }
      return res.json(parcours);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  },

  // Get a single parcours, according to its id
  async filterParcoursByName(req, res) {
    console.log("filterParcoursByName");
    try {
      const parcours = await prisma.parcours.findMany({
        where: { name: { contains: req.params.name, mode: 'insensitive' } }
      });
      if (!parcours) {
        return res.status(422).json({ message: "L'opération n'a pas pu être effectuée" });
      }
      return res.json(parcours);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  },

  async duoFilter(req, res) {
    let parcours;
    try {
      // If price > 0 and difficulty > 0
      if (req.params.price > 0 && req.params.difficulty > 0) {
        parcours = await prisma.parcours.findMany({
          where: {
            difficulty: parseInt(req.params.difficulty, 10),
            price: { lt: parseInt(req.params.price, 10) }
          }
        });
      } else {
        // If price > 0 and difficulty = 0
        if (req.params.price > 0) {
          parcours = await prisma.parcours.findMany({
            where: { price: { lte: parseInt(req.params.price, 10) } }
          });
        }
        // If price = 0 and difficulty > 0
        if (req.params.difficulty > 0) {
          parcours = await prisma.parcours.findMany({
            where: { difficulty: parseInt(req.params.difficulty, 10) }
          });
        }
      }
      if (!parcours) {
        return res.status(422).json({ message: "L'opération n'a pas pu être effectuée" });
      }
      return res.json(parcours);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  }
};

module.exports = parcoursCtrl;
