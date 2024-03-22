/*
  Warnings:

  - You are about to drop the column `items_count` on the `ProductSpecs` table. All the data in the column will be lost.
  - You are about to drop the `Rating` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_id_fkey";

-- AlterTable
ALTER TABLE "ProductSpecs" DROP COLUMN "items_count";

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Rating";
