/*
  Warnings:

  - Added the required column `type` to the `Barang` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Barang" ADD COLUMN     "type" TEXT NOT NULL;
