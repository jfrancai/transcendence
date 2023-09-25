/*
  Warnings:

  - Made the column `reason` on table `ChanRestrict` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ChanRestrict" ALTER COLUMN "reason" SET NOT NULL;
