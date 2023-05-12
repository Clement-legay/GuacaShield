/*
  Warnings:

  - You are about to drop the column `Status` on the `Incident` table. All the data in the column will be lost.
  - Added the required column `status` to the `Incident` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Incident" DROP COLUMN "Status",
ADD COLUMN     "status" TEXT NOT NULL;
