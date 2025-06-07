/*
  Warnings:

  - The values [tools,books,projects] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Books` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Projects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tools` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Category_new" AS ENUM ('Tshirt', 'Hoodies', 'Streetwear', 'luxury', 'Jackets', 'Sweatshirts');
ALTER TABLE "Item" ALTER COLUMN "type" TYPE "Category_new" USING ("type"::text::"Category_new");
ALTER TYPE "Category" RENAME TO "Category_old";
ALTER TYPE "Category_new" RENAME TO "Category";
DROP TYPE "Category_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Books" DROP CONSTRAINT "Books_barang_id_fkey";

-- DropForeignKey
ALTER TABLE "Projects" DROP CONSTRAINT "Projects_barang_id_fkey";

-- DropForeignKey
ALTER TABLE "Tools" DROP CONSTRAINT "Tools_barang_id_fkey";

-- DropTable
DROP TABLE "Books";

-- DropTable
DROP TABLE "Projects";

-- DropTable
DROP TABLE "Tools";
