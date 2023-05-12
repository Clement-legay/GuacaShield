/*
  Warnings:

  - You are about to drop the column `Valid` on the `City` table. All the data in the column will be lost.
  - You are about to drop the column `Valid` on the `SuperHero` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "City" DROP COLUMN "Valid",
ADD COLUMN     "valid" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "SuperHero" DROP COLUMN "Valid",
ADD COLUMN     "valid" BOOLEAN NOT NULL DEFAULT false;
