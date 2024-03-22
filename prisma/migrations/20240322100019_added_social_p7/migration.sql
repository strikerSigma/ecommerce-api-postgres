/*
  Warnings:

  - You are about to drop the column `customerId` on the `Analytics` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Analytics" DROP CONSTRAINT "Analytics_customerId_fkey";

-- AlterTable
ALTER TABLE "Analytics" DROP COLUMN "customerId",
ADD COLUMN     "Revenue" INTEGER NOT NULL DEFAULT 0;
