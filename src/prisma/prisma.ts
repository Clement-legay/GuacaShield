import { Prisma as PrismaBase, PrismaClient } from '@prisma/client';

export const Prisma = {
  provide: PrismaClient,
  useValue: new PrismaClient(),
};

export async function isForeignKeyValidator(
  tableName: string,
  foreignKey: number,
): Promise<boolean> {
  const prisma = new PrismaClient();
  const tableArg = PrismaBase.raw(`"${tableName}"`);
  const foreignKeyArg = PrismaBase.raw(`${foreignKey}`);
  const result =
    await prisma.$queryRaw`SELECT EXISTS(SELECT 1 FROM ${tableArg} WHERE id = ${foreignKeyArg})`;
  return result[0].exists;
}
