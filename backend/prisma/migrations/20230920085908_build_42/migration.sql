/*
  Warnings:

  - You are about to drop the column `creatorId` on the `Message` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ChatRestrictType" AS ENUM ('BAN', 'MUTE');

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_creatorId_fkey";

-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "admins" UUID[];

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "creatorId";

-- CreateTable
CREATE TABLE "ChatRestrict" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" "ChatRestrictType" NOT NULL DEFAULT 'MUTE',
    "restrictedId" UUID NOT NULL,
    "chatId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatRestrict_pkey" PRIMARY KEY ("id")
);
