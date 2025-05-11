/*
  Warnings:

  - You are about to drop the column `description` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `FinalProject` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `FinalProject` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Tools` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Tools` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Tools` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "description",
DROP COLUMN "image",
DROP COLUMN "name";

-- AlterTable
ALTER TABLE "FinalProject" DROP COLUMN "image",
DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Tools" DROP COLUMN "description",
DROP COLUMN "image",
DROP COLUMN "name";
