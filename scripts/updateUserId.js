const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateUserIds() {
  try {
    const result = await prisma.$executeRaw`
      UPDATE "Post" SET "userId" = 1 WHERE "userId" IS NULL
    `;
    console.log('Query executed:', result);
  } catch (err) {
    console.error('Error executing raw SQL:', err);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserIds();
