const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const dateFormatting = Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short"
});

const treksCtrl = {
  // Get all dates for all parcours
  async getTreksList(req, res) {
    try {
      const list = await prisma.treks.findMany();
      if (!list) {
        return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
      }
      return res.json(list);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  },

  // Get a list of dates for a parcours
  async getTreksForParcours(req, res) {
    try {
      const parcours = await prisma.parcours.findUnique({ where: { slug: req.params.slug } });
      if (!parcours) {
        return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
      }

      const list = await prisma.treks.findMany({ where: { parcours_id: parcours.parcours_id } });
      if (!list) {
        return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
      }
      return res.json(list);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  },

  // Create a trek
  async createTrek(req, res) {
    const { beginDate, endDate, parcours, guide, minPlaces, maxPlaces } = req.body;

    try {
      const parcoursData = await prisma.parcours.findFirst({ where: { slug: parcours } });
      if (!parcoursData) {
        return res.status(422).json({ message: "L'opération n'a pas pu être effectuée" });
      }

      const guideData = await prisma.guides.findFirst({ where: { slug: guide } });
      if (!guideData) {
        return res.status(422).json({ message: "L'opération n'a pas pu être effectuée" });
      }

      const dateFormat = beginDate.slice(8) + "/" + beginDate.slice(5, 7) + "/" + beginDate.slice(0, 4);
      let trekName = "Trek du " + dateFormat;
      let trekSlug = "trek-" + beginDate.slice(0, 10) + endDate.slice(0, 10);

      const newTrek = await prisma.treks.create({
        data: {
          begin_date: new Date(beginDate),
          end_date: new Date(endDate),
          min_places: Number(minPlaces),
          max_places:  Number(maxPlaces),
          parcours_id: parcoursData.parcours_id,
          guide_id: guideData.guide_id,
          slug: trekSlug,
          trek_state: "A venir"
        }
      });

      return res.status(201).json({ message: "Trek créé", trek: newTrek });
    } catch (error) {
      console.error(error);
      return res.status(422).json({ message: "Une erreur inattendue est survenue" });
    }
  },

  // Update a trek
  async updateTrek(req, res) {
    const body = req.body;
    try {
      const trek = await prisma.treks.findUnique({ where: { slug: body.slug } });
      if (!trek) {
        return res.status(422).json({ message: "L'opération n'a pas pu être effectuée" });
      }

      let updatedData = {};
      if (body.beginDate && body.endDate) {
        const dateFormat = body.beginDate.slice(8) + "/" + body.beginDate.slice(5, 7) + "/" + body.beginDate.slice(0, 4);
        let trekName = "Trek du " + dateFormat;
        let trekSlug = "trek-" + body.beginDate.slice(0, 10) + body.endDate.slice(0, 10);
        updatedData = { ...updatedData, begin_date: new Date(body.beginDate), end_date: new Date(body.endDate), slug: trekSlug };
      }

      if (body.minPlaces) {
        updatedData.min_places = body.minPlaces;
      }
      if (body.maxPlaces) {
        updatedData.max_places = body.maxPlaces;
      }
      if (body.trekState) {
        updatedData.trek_state = body.trekState;
      }

      const updatedTrek = await prisma.treks.update({
        where: { slug: body.slug },
        data: updatedData
      });

      return res.status(200).json({ status: 200, message: "Trek modifié", trek: updatedTrek });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  },

  // Get a single trek by slug
  async getSingleTrek(req, res) {
    try {
      const trek = await prisma.treks.findUnique({ where: { slug: req.params.slug } });
      if (!trek) {
        return res.status(422).json({ message: "L'opération n'a pas pu être effectuée" });
      }
      return res.json(trek);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  },

  // Get a list of treks for a guide
  async getTrekListForGuide(req, res) {
    try {
      const guide = await prisma.guides.findUnique({ where: { slug: req.params.slug } });
      if (!guide) {
        return res.status(422).json({ message: "L'opération n'a pas pu être effectuée" });
      }

      const trekList = await prisma.treks.findMany({ where: { guide_id: guide.guide_id } });
      if (!trekList) {
        return res.status(422).json({ message: "L'opération n'a pas pu être effectuée" });
      }
      return res.json(trekList);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  }
};

module.exports = treksCtrl;
