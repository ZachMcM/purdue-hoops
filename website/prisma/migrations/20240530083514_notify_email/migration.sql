/*
  Warnings:

  - You are about to drop the `ReleaseEmails` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ReleaseEmails";

-- CreateTable
CREATE TABLE "NotifyEmail" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "NotifyEmail_pkey" PRIMARY KEY ("id")
);
