/*
  Warnings:

  - Added the required column `customer_id` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_order_id_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "customer_id" TEXT NOT NULL,
ADD COLUMN     "quantity" INTEGER[],
ADD COLUMN     "total" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
