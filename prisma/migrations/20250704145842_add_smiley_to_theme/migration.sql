/*
  Warnings:

  - You are about to drop the column `emoji` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "emoji",
ADD COLUMN     "emojis" TEXT;
