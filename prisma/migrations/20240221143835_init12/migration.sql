/*
  Warnings:

  - Made the column `address` on table `Customer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "address" SET DEFAULT '';
