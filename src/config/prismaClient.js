// src/config/prismaClient.js
const { PrismaClient } = require('@prisma/client');

let prisma;

if (!global.prismaInstance) {
  prisma = new PrismaClient();
  global.prismaInstance = prisma;
} else {
  prisma = global.prismaInstance;
}

module.exports = prisma;
