/*
  Warnings:

  - The `timestamp` column on the `Match` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "timestamp",
ADD COLUMN     "timestamp" INTEGER NOT NULL DEFAULT 0;
