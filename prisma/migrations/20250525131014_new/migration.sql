/*
  Warnings:

  - You are about to drop the `Collaborator` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Collaborator";

-- CreateTable
CREATE TABLE "Collaborators" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" TEXT NOT NULL,
    "role" "CollaboratorRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collaborators_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Collaborators_email_key" ON "Collaborators"("email");
