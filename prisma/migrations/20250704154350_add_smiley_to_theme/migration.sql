/*
  Warnings:

  - A unique constraint covering the columns `[smiley]` on the table `Theme` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `smiley` to the `Theme` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Theme" ADD COLUMN     "smiley" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Theme_smiley_key" ON "Theme"("smiley");
