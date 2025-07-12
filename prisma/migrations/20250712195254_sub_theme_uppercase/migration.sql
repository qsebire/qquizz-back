/*
  Warnings:

  - You are about to drop the column `subthemeId` on the `Question` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_subthemeId_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "subthemeId",
ADD COLUMN     "subThemeId" INTEGER;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_subThemeId_fkey" FOREIGN KEY ("subThemeId") REFERENCES "SubTheme"("id") ON DELETE SET NULL ON UPDATE CASCADE;
