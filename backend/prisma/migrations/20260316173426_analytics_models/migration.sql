/*
  Warnings:

  - You are about to drop the column `tier` on the `Sponsor` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `Sponsorship` table. All the data in the column will be lost.
  - You are about to drop the column `roi` on the `Sponsorship` table. All the data in the column will be lost.
  - Added the required column `attendees` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `engagement` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `revenue` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `investment` to the `Sponsorship` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_organizerId_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "attendees" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "engagement" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "revenue" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "organizerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Sponsor" DROP COLUMN "tier",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Sponsorship" DROP COLUMN "amount",
DROP COLUMN "roi",
ADD COLUMN     "investment" DOUBLE PRECISION NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
