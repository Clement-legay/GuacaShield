/*
  Warnings:

  - You are about to drop the column `heroId` on the `HeroToIncident` table. All the data in the column will be lost.
  - You are about to drop the column `heroId` on the `HeroToType` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[coordinatesId]` on the table `City` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[coordinatesId]` on the table `Incident` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[coordinatesId]` on the table `SuperHero` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cityId` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `superHeroId` to the `HeroToIncident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `superHeroId` to the `HeroToType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "cityId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "HeroToIncident" DROP COLUMN "heroId",
ADD COLUMN     "superHeroId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "HeroToType" DROP COLUMN "heroId",
ADD COLUMN     "superHeroId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "City_coordinatesId_key" ON "City"("coordinatesId");

-- CreateIndex
CREATE UNIQUE INDEX "Incident_coordinatesId_key" ON "Incident"("coordinatesId");

-- CreateIndex
CREATE UNIQUE INDEX "SuperHero_coordinatesId_key" ON "SuperHero"("coordinatesId");

-- AddForeignKey
ALTER TABLE "SuperHero" ADD CONSTRAINT "SuperHero_coordinatesId_fkey" FOREIGN KEY ("coordinatesId") REFERENCES "Coordinates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeroToType" ADD CONSTRAINT "HeroToType_superHeroId_fkey" FOREIGN KEY ("superHeroId") REFERENCES "SuperHero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeroToType" ADD CONSTRAINT "HeroToType_incidentTypeId_fkey" FOREIGN KEY ("incidentTypeId") REFERENCES "IncidentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "IncidentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_coordinatesId_fkey" FOREIGN KEY ("coordinatesId") REFERENCES "Coordinates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_coordinatesId_fkey" FOREIGN KEY ("coordinatesId") REFERENCES "Coordinates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeroToIncident" ADD CONSTRAINT "HeroToIncident_superHeroId_fkey" FOREIGN KEY ("superHeroId") REFERENCES "SuperHero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeroToIncident" ADD CONSTRAINT "HeroToIncident_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
