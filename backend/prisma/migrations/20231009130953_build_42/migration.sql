/*
  Warnings:

  - You are about to drop the `ChanInvite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChanRestrict` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChanInvite" DROP CONSTRAINT "ChanInvite_channelID_fkey";

-- DropForeignKey
ALTER TABLE "ChanInvite" DROP CONSTRAINT "ChanInvite_usersID_fkey";

-- DropForeignKey
ALTER TABLE "ChanRestrict" DROP CONSTRAINT "ChanRestrict_channelID_fkey";

-- DropForeignKey
ALTER TABLE "ChanRestrict" DROP CONSTRAINT "ChanRestrict_usersID_fkey";

-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "bans" UUID[],
ADD COLUMN     "mute" UUID[];

-- DropTable
DROP TABLE "ChanInvite";

-- DropTable
DROP TABLE "ChanRestrict";
