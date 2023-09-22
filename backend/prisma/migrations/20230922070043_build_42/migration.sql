/*
  Warnings:

  - You are about to drop the column `banList` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `inviteList` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `muteList` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the `ChatRestrict` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "banList",
DROP COLUMN "inviteList",
DROP COLUMN "muteList";

-- DropTable
DROP TABLE "ChatRestrict";

-- CreateTable
CREATE TABLE "ChannelInvitation" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "usersId" UUID NOT NULL,
    "channelId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChannelInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChannelRestrict" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" "ChatRestrictType" NOT NULL DEFAULT 'MUTE',
    "usersId" UUID NOT NULL,
    "channelId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endOfRestrict" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChannelRestrict_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChannelInvitation" ADD CONSTRAINT "ChannelInvitation_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelInvitation" ADD CONSTRAINT "ChannelInvitation_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelRestrict" ADD CONSTRAINT "ChannelRestrict_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelRestrict" ADD CONSTRAINT "ChannelRestrict_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
