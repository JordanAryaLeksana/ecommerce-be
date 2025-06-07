-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'user');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'user';
