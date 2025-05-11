/*
  Warnings:

  - Added the required column `price` to the `Barang` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Barang" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;
