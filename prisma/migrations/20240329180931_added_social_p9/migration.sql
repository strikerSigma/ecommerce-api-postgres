/*
  Warnings:

  - You are about to drop the column `customerId` on the `Notifications` table. All the data in the column will be lost.
  - You are about to drop the column `notifications` on the `Notifications` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_customerId_fkey";

-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "profileuri" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Notifications" DROP COLUMN "customerId",
DROP COLUMN "notifications",
ADD COLUMN     "notification" TEXT,
ADD COLUMN     "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
