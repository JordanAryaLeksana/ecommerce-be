/*
  Warnings:

  - Added the required column `stock` to the `Barang` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Barang" ADD COLUMN     "stock" INTEGER NOT NULL;
