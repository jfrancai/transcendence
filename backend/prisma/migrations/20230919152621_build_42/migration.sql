/*
  Warnings:

  - Added the required column `creatorId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('PUBLIC', 'PRIVATE', 'PASSWORD');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "creatorId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "Channel" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "displayName" TEXT NOT NULL,
    "type" "ChannelType" NOT NULL DEFAULT 'PUBLIC',
    "creatorId" UUID NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
