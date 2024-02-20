/*
  Warnings:

  - You are about to drop the `CustomMeal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FavoriteFood` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Food` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FoodCatalog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Target` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CustomMeal" DROP CONSTRAINT "CustomMeal_userId_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteFood" DROP CONSTRAINT "FavoriteFood_userId_fkey";

-- DropForeignKey
ALTER TABLE "Food" DROP CONSTRAINT "Food_catalogId_fkey";

-- DropForeignKey
ALTER TABLE "Food" DROP CONSTRAINT "Food_favoriteId_fkey";

-- DropForeignKey
ALTER TABLE "Food" DROP CONSTRAINT "Food_mealId_fkey";

-- DropForeignKey
ALTER TABLE "FoodCatalog" DROP CONSTRAINT "FoodCatalog_userId_fkey";

-- DropForeignKey
ALTER TABLE "Target" DROP CONSTRAINT "Target_userId_fkey";

-- DropTable
DROP TABLE "CustomMeal";

-- DropTable
DROP TABLE "FavoriteFood";

-- DropTable
DROP TABLE "Food";

-- DropTable
DROP TABLE "FoodCatalog";

-- DropTable
DROP TABLE "Target";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "address" TEXT,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "price" INTEGER NOT NULL DEFAULT 0,
    "desc" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "cart_id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("cart_id")
);

-- CreateTable
CREATE TABLE "CartToProduct" (
    "cart_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "itemcount" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "CartToProduct_pkey" PRIMARY KEY ("cart_id","product_id")
);

-- CreateTable
CREATE TABLE "ProductColor" (
    "product_id" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "item_count" INTEGER NOT NULL DEFAULT 0,
    "imageuri" TEXT,

    CONSTRAINT "ProductColor_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "ProductSpecs" (
    "product_id" INTEGER NOT NULL,
    "specs" TEXT NOT NULL,
    "items_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProductSpecs_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "customer_id" INTEGER NOT NULL,
    "id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "review" TEXT,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id","customer_id")
);

-- CreateTable
CREATE TABLE "Wishlist" (
    "customer_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("customer_id","product_id")
);

-- CreateTable
CREATE TABLE "Order" (
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER[],
    "address" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("order_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_token_key" ON "Customer"("token");

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartToProduct" ADD CONSTRAINT "CartToProduct_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "Cart"("cart_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartToProduct" ADD CONSTRAINT "CartToProduct_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductColor" ADD CONSTRAINT "ProductColor_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSpecs" ADD CONSTRAINT "ProductSpecs_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_id_fkey" FOREIGN KEY ("id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
