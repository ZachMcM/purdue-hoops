-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "image" TEXT,
    "feet" INTEGER,
    "inches" INTEGER,
    "weight" DECIMAL(65,30),
    "position" TEXT,
    "primarySkill" TEXT,
    "secondarySkill" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ratings" INTEGER[],
    "hoopingStatus" TEXT,
    "hoopingHistory" TIMESTAMP(3)[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");
