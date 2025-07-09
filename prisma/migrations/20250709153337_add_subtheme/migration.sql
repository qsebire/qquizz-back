-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "subthemeId" INTEGER;

-- CreateTable
CREATE TABLE "SubTheme" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubTheme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubTheme_name_key" ON "SubTheme"("name");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_subthemeId_fkey" FOREIGN KEY ("subthemeId") REFERENCES "SubTheme"("id") ON DELETE SET NULL ON UPDATE CASCADE;
