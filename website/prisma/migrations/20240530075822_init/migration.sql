-- CreateTable
CREATE TABLE "SupportMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "SupportMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReleaseEmails" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "ReleaseEmails_pkey" PRIMARY KEY ("id")
);
