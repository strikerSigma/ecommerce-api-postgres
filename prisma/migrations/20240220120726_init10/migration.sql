/*
  Warnings:

  - The primary key for the `ProductColor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ProductSpecs` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "ProductColor" DROP CONSTRAINT "ProductColor_pkey",
ADD CONSTRAINT "ProductColor_pkey" PRIMARY KEY ("color", "product_id");

-- AlterTable
ALTER TABLE "ProductSpecs" DROP CONSTRAINT "ProductSpecs_pkey",
ADD CONSTRAINT "ProductSpecs_pkey" PRIMARY KEY ("specs", "product_id");
