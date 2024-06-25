require('dotenv').config(); // Charger les variables d'environnement
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

async function createSuperAdmin() {
  const email = 'superadmin@example.com';
  const password = 'AAAaaa111!';
  const role = 'super-admin';

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Check if the superadmin already exists
    const existingSuperAdmin = await prisma.admins.findUnique({
      where: { email: email },
    });

    if (!existingSuperAdmin) {
      // Insert the superadmin into the database
      const superAdmin = await prisma.admins.create({
        data: {
          email: email,
          password: hashedPassword,
          role: role,
          slug: 'superadmin',
          created_at: new Date(),
        },
      });

      // Generate json web token
      const token = jwt.sign({ userId: superAdmin.admin_id }, process.env.SECRET_KEY, { expiresIn: '24h' });
      console.log('Superadmin created:', superAdmin);
      console.log('Generated token:', token);
    } else {
      console.log('Superadmin already exists.');
    }
  } catch (error) {
    console.error('Error creating superadmin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();
