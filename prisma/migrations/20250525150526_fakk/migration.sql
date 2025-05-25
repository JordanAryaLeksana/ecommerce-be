/*
  Warnings:

  - You are about to drop the `UserCollab` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "UserCollab";

-- CreateTable
CREATE TABLE "Coollaborator" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" TEXT NOT NULL,
    "role" "CollaboratorRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coollaborator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coollaborator_email_key" ON "Coollaborator"("email");
