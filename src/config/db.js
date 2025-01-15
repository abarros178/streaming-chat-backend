import { PrismaClient } from '@prisma/client';

/**
 * Instancia única de Prisma Client para interactuar con la base de datos.
 * Prisma proporciona un ORM (Object-Relational Mapping) para consultas
 * seguras y eficientes.
 *
 * @example
 * const users = await prisma.user.findMany();
 */
const prisma = new PrismaClient();

export default prisma;
