/*
  Warnings:

  - You are about to drop the column `hoopingHistory` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `ratings` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "hoopingHistory",
DROP COLUMN "ratings";

-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "incomingId" TEXT NOT NULL,
    "outgoingId" TEXT NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HoopSession" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gym" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "HoopSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Rating_id_idx" ON "Rating"("id");

-- CreateIndex
CREATE INDEX "HoopSession_id_idx" ON "HoopSession"("id");

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_incomingId_fkey" FOREIGN KEY ("incomingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_outgoingId_fkey" FOREIGN KEY ("outgoingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HoopSession" ADD CONSTRAINT "HoopSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
