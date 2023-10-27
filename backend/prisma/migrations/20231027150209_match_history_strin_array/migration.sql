/*
  Warnings:

  - You are about to drop the `Match` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_usersId_fkey";

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "matchHistory" TEXT[];

-- DropTable
DROP TABLE "Match";
