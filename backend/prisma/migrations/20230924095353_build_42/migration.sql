-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('PUBLIC', 'PRIVATE', 'PASSWORD');

-- CreateEnum
CREATE TYPE "ChatRestrictType" AS ENUM ('BAN', 'MUTE');

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "connectedChat" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Message" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "content" TEXT NOT NULL,
    "senderId" UUID NOT NULL,
    "receiverId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "channelId" UUID,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Channel" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "chanName" TEXT NOT NULL,
    "type" "ChannelType" NOT NULL DEFAULT 'PRIVATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password" TEXT,
    "creatorId" UUID NOT NULL,
    "admins" UUID[],

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChannelToUsers" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Channel_chanName_key" ON "Channel"("chanName");

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelToUsers_AB_unique" ON "_ChannelToUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelToUsers_B_index" ON "_ChannelToUsers"("B");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChanInvite" ADD CONSTRAINT "ChanInvite_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChanInvite" ADD CONSTRAINT "ChanInvite_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChanRestrict" ADD CONSTRAINT "ChanRestrict_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChanRestrict" ADD CONSTRAINT "ChanRestrict_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToUsers" ADD CONSTRAINT "_ChannelToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToUsers" ADD CONSTRAINT "_ChannelToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
