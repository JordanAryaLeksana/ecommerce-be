/*
  Warnings:

  - You are about to drop the `Finalprojects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Finalprojects" DROP CONSTRAINT "Finalprojects_barang_id_fkey";

-- DropTable
DROP TABLE "Finalprojects";

-- CreateTable
CREATE TABLE "Projects" (
    "id" TEXT NOT NULL,
    "barang_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_barang_id_fkey" FOREIGN KEY ("barang_id") REFERENCES "Barang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
