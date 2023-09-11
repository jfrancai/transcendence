-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "twoAuthOn" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoAuthSecret" TEXT;
