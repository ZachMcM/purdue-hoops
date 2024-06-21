-- CreateTable
CREATE TABLE "Friendship" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "incomingId" TEXT NOT NULL,
    "outgoingId" TEXT NOT NULL,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Friendship_id_idx" ON "Friendship"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_incomingId_outgoingId_key" ON "Friendship"("incomingId", "outgoingId");

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_incomingId_fkey" FOREIGN KEY ("incomingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_outgoingId_fkey" FOREIGN KEY ("outgoingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
