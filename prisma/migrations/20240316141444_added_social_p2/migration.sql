/*
  Warnings:

  - The `orders` column on the `Analytics` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Analytics" DROP COLUMN "orders",
ADD COLUMN     "orders" TEXT[];
