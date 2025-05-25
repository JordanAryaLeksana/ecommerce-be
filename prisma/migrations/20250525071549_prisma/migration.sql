-- CreateEnum
CREATE TYPE "CollaboratorRole" AS ENUM ('ECOMMERCE_EXPERT', 'SUPPLIER', 'INFLUENCER', 'DEVELOPER');

-- CreateTable
CREATE TABLE "Collaborator" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "role" "CollaboratorRole" NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collaborator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Collaborator_email_key" ON "Collaborator"("email");
