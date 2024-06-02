/*
  Warnings:

  - The primary key for the `Rating` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Rating` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Rating_id_idx";

-- AlterTable
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Rating_pkey" PRIMARY KEY ("incomingId", "outgoingId");
