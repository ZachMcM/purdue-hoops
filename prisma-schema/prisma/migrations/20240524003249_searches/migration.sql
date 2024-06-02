/*
  Warnings:

  - Made the column `hoopingStatus` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "hoopingStatus" SET NOT NULL,
ALTER COLUMN "hoopingStatus" SET DEFAULT 'not-hooping';

-- CreateTable
CREATE TABLE "_searches" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_searches_AB_unique" ON "_searches"("A", "B");

-- CreateIndex
CREATE INDEX "_searches_B_index" ON "_searches"("B");

-- AddForeignKey
ALTER TABLE "_searches" ADD CONSTRAINT "_searches_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_searches" ADD CONSTRAINT "_searches_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
