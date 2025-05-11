/*
  Warnings:

  - You are about to drop the `FinalProjects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FinalProjects" DROP CONSTRAINT "FinalProjects_barang_id_fkey";

-- DropTable
DROP TABLE "FinalProjects";

-- CreateTable
CREATE TABLE "Finalprojects" (
    "id" TEXT NOT NULL,
    "barang_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Finalprojects_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Finalprojects" ADD CONSTRAINT "Finalprojects_barang_id_fkey" FOREIGN KEY ("barang_id") REFERENCES "Barang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
