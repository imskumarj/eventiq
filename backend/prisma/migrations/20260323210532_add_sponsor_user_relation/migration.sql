/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Sponsor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Sponsor" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Sponsor_userId_key" ON "Sponsor"("userId");

-- AddForeignKey
ALTER TABLE "Sponsor" ADD CONSTRAINT "Sponsor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
