/*
  Warnings:

  - You are about to drop the column `audioUrl` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "audioUrl",
DROP COLUMN "imageUrl",
DROP COLUMN "videoUrl",
ADD COLUMN     "difficulty" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "mediaUrl" TEXT;
