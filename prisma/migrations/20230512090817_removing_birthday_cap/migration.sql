/*
  Warnings:

  - You are about to drop the column `Birthday` on the `SuperHero` table. All the data in the column will be lost.
  - Added the required column `birthday` to the `SuperHero` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SuperHero" DROP COLUMN "Birthday",
ADD COLUMN     "birthday" TIMESTAMP(3) NOT NULL;
