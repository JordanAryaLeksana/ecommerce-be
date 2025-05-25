/*
  Warnings:

  - The values [ECOMMERCE_EXPERT,SUPPLIER,INFLUENCER,DEVELOPER] on the enum `CollaboratorRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CollaboratorRole_new" AS ENUM ('ecommerce_expert', 'supplier', 'influencer', 'developer');
ALTER TABLE "Collaborator" ALTER COLUMN "role" TYPE "CollaboratorRole_new" USING ("role"::text::"CollaboratorRole_new");
ALTER TYPE "CollaboratorRole" RENAME TO "CollaboratorRole_old";
ALTER TYPE "CollaboratorRole_new" RENAME TO "CollaboratorRole";
DROP TYPE "CollaboratorRole_old";
COMMIT;
