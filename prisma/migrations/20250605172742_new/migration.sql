/*
  Warnings:

  - You are about to drop the `CartItems` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CartItems" DROP CONSTRAINT "CartItems_cartId_fkey";

-- DropForeignKey
ALTER TABLE "CartItems" DROP CONSTRAINT "CartItems_itemId_fkey";

-- DropTable
DROP TABLE "CartItems";

-- CreateTable
CREATE TABLE "_CartToItem" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CartToItem_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CartToItem_B_index" ON "_CartToItem"("B");

-- AddForeignKey
ALTER TABLE "_CartToItem" ADD CONSTRAINT "_CartToItem_A_fkey" FOREIGN KEY ("A") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CartToItem" ADD CONSTRAINT "_CartToItem_B_fkey" FOREIGN KEY ("B") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
