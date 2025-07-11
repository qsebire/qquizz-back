/*
  Warnings:

  - You are about to drop the column `allowedAnswerMode` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "allowedAnswerMode",
ADD COLUMN     "allowedAnswerModes" "AnswerMode"[];
