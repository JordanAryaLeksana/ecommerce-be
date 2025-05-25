/*
  Warnings:

  - You are about to drop the `Collaborator` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Collaborator";

-- CreateTable
CREATE TABLE "UserCollab" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" TEXT NOT NULL,
    "role" "CollaboratorRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCollab_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserCollab_email_key" ON "UserCollab"("email");
