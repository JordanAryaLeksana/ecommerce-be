/*
  Warnings:

  - The values [final_projects] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Book` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FinalProject` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Category_new" AS ENUM ('tools', 'books', 'final_project');
ALTER TABLE "Barang" ALTER COLUMN "type" TYPE "Category_new" USING ("type"::text::"Category_new");
ALTER TYPE "Category" RENAME TO "Category_old";
ALTER TYPE "Category_new" RENAME TO "Category";
DROP TYPE "Category_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_barang_id_fkey";

-- DropForeignKey
ALTER TABLE "FinalProject" DROP CONSTRAINT "FinalProject_barang_id_fkey";

-- DropTable
DROP TABLE "Book";

-- DropTable
DROP TABLE "FinalProject";

-- CreateTable
CREATE TABLE "Books" (
    "id" TEXT NOT NULL,
    "writer" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "barang_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinalProjects" (
    "id" TEXT NOT NULL,
    "barang_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinalProjects_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Books" ADD CONSTRAINT "Books_barang_id_fkey" FOREIGN KEY ("barang_id") REFERENCES "Barang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalProjects" ADD CONSTRAINT "FinalProjects_barang_id_fkey" FOREIGN KEY ("barang_id") REFERENCES "Barang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
