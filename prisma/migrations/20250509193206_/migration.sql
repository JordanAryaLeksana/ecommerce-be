/*
  Warnings:

  - The values [book,final_project] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Category_new" AS ENUM ('tools', 'books', 'final_projects');
ALTER TABLE "Barang" ALTER COLUMN "type" TYPE "Category_new" USING ("type"::text::"Category_new");
ALTER TYPE "Category" RENAME TO "Category_old";
ALTER TYPE "Category_new" RENAME TO "Category";
DROP TYPE "Category_old";
COMMIT;
