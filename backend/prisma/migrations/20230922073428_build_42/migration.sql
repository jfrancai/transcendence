/*
  Warnings:

  - You are about to drop the `ChannelInvitation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChannelRestrict` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChannelInvitation" DROP CONSTRAINT "ChannelInvitation_channelId_fkey";

-- DropForeignKey
ALTER TABLE "ChannelInvitation" DROP CONSTRAINT "ChannelInvitation_usersId_fkey";

-- DropForeignKey
ALTER TABLE "ChannelRestrict" DROP CONSTRAINT "ChannelRestrict_channelId_fkey";

-- DropForeignKey
ALTER TABLE "ChannelRestrict" DROP CONSTRAINT "ChannelRestrict_usersId_fkey";

-- DropTable
DROP TABLE "ChannelInvitation";

-- DropTable
DROP TABLE "ChannelRestrict";

-- CreateTable
CREATE TABLE "ChanInvite" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "usersId" UUID NOT NULL,
    "channelId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChanInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChanRestrict" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" "ChatRestrictType" NOT NULL DEFAULT 'MUTE',
    "usersId" UUID NOT NULL,
    "channelId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endOfRestrict" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChanRestrict_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChanInvite" ADD CONSTRAINT "ChanInvite_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChanInvite" ADD CONSTRAINT "ChanInvite_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChanRestrict" ADD CONSTRAINT "ChanRestrict_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChanRestrict" ADD CONSTRAINT "ChanRestrict_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
