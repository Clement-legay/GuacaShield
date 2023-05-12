import { PrismaClient } from '@prisma/client';
import { ValidatorConstraint } from 'class-validator';

export const Prisma = {
  provide: PrismaClient,
  useValue: new PrismaClient(),
};

@ValidatorConstraint({ name: 'isForeignKey', async: true })
export class IsForeignKeyValidator {
  async validate(tableName: string, value: any) {
    const { cityId } = value;
    return isForeignKeyValidator(tableName, cityId);
  }

  defaultMessage() {
    return 'Element does not exist.';
  }
}

async function isForeignKeyValidator(tableName: string, foreignKey: number) {
  const prisma = new PrismaClient();
  const query = `SELECT EXISTS (SELECT FROM ${tableName} WHERE id = ${foreignKey})`;
  const result = this.prisma.$queryRaw(query);
  await prisma.$disconnect();
  return result[0].exists;
}
