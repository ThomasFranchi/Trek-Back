const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const clientsCtrl = {
  // Get the users list from the database
  async getClientsList(req, res) {
    try {
      const list = await prisma.users.findMany();
      if (!list) {
        return res
          .status(500)
          .json({ message: "Une erreur inattendue s'est produite" });
      }
      return res.json(list);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  },

  // Update the user with all the new information
  async updateClientAdmin(req, res) {
    const body = req.body;
    try {
      const client = await prisma.users.findUnique({ where: { slug: body.slug } });
      if (!client) {
        return res
          .status(422)
          .json({ message: "L'opération n'a pas pu être effectuée" });
      }
      
      let updatedData = {};
      if (body.firstName && body.lastName) {
        updatedData.firstName = body.firstName;
        updatedData.lastName = body.lastName;
        updatedData.slug = body.firstName.toLowerCase().replaceAll(" ", "-") + body.lastName.toLowerCase().replaceAll(" ", "-");
      } else {
        if (body.firstName) {
          updatedData.firstName = body.firstName;
          updatedData.slug = body.firstName.toLowerCase().replaceAll(" ", "-") + client.lastName.toLowerCase().replaceAll(" ", "-");
        }
        if (body.lastName) {
          updatedData.lastName = body.lastName;
          updatedData.slug = client.firstName.toLowerCase().replaceAll(" ", "-") + body.lastName.toLowerCase().replaceAll(" ", "-");
        }
      }

      if (body.mail) {
        updatedData.email = body.mail;
      }

      if (req.file) {
        updatedData.client_picture = "/uploads/" + req.file.filename;
      }

      if (body.password) {
        updatedData.password = await bcrypt.hash(body.password, 10);
      }

      const updatedClient = await prisma.users.update({
        where: { slug: body.slug },
        data: updatedData
      });

      return res.status(200).json({ message: "Client modifié", client: updatedClient });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  },

  // Update the user with all the new information
  async updateClient(req, res) {
    const client = req.user;
    const body = req.body;

    if (!client) {
      return res
        .status(422)
        .json({ message: "L'opération n'a pas pu être effectuée" });
    }

    let updatedData = {};
    if (body.firstName && body.lastName) {
      updatedData.firstName = body.firstName;
      updatedData.lastName = body.lastName;
      updatedData.slug = body.firstName.toLowerCase().replaceAll(" ", "-") + body.lastName.toLowerCase().replaceAll(" ", "-");
    } else {
      if (body.firstName) {
        updatedData.firstName = body.firstName;
        updatedData.slug = body.firstName.toLowerCase().replaceAll(" ", "-") + client.lastName.toLowerCase().replaceAll(" ", "-");
      }
      if (body.lastName) {
        updatedData.lastName = body.lastName;
        updatedData.slug = client.firstName.toLowerCase().replaceAll(" ", "-") + body.lastName.toLowerCase().replaceAll(" ", "-");
      }
    }

    if (body.mail) {
      updatedData.email = body.mail;
    }

    if (req.file) {
      updatedData.client_picture = "/uploads/" + req.file.filename;
    }

    if (body.password) {
      updatedData.password = bcrypt.hashSync(body.password, 10);
    }

    try {
      const updatedClient = await prisma.users.update({
        where: { user_id: client.user_id },
        data: updatedData
      });
      return res.status(200).json({ message: "Client modifié", client: updatedClient });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  },

  // Delete a client
  async deleteClient(req, res) {
    const { slug } = req.body;
    try {
      const client = await prisma.users.delete({ where: { slug: slug } });
      return res.status(200).json({ status: "200", message: "Client supprimé" });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  },

  // Get a single client by its slug
  async getSingleClient(req, res) {
    try {
      const client = await prisma.users.findFirst({ where: { slug: req.params.slug } });
      if (!client) {
        return res.status(422).json({ message: "L'opération n'a pas pu être effectuée" });
      }
      return res.json(client);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  },

  async getSingleClientById(req, res) {
    try {
      const client = await prisma.users.findUnique({ where: { user_id: parseInt(req.params.id, 10) } });
      if (!client) {
        return res.status(422).json({ message: "L'opération n'a pas pu être effectuée" });
      }
      return res.json(client);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  }
};

module.exports = clientsCtrl;
