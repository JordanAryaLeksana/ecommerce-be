/*
  Warnings:

  - You are about to drop the `books` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `type` on the `Barang` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('tools', 'book', 'final_project');

-- DropForeignKey
ALTER TABLE "books" DROP CONSTRAINT "books_barang_id_fkey";

-- AlterTable
ALTER TABLE "Barang" DROP COLUMN "type",
ADD COLUMN     "type" "Category" NOT NULL;

-- DropTable
DROP TABLE "books";

-- CreateTable
CREATE TABLE "book" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "writer" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "barang_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "book_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "book" ADD CONSTRAINT "book_barang_id_fkey" FOREIGN KEY ("barang_id") REFERENCES "Barang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
