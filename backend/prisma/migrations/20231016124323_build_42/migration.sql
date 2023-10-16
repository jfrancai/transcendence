-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('PUBLIC', 'PRIVATE', 'PASSWORD');

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "blockList" UUID[],
ADD COLUMN     "connectedChat" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "img" SET DEFAULT '/home/jfrancai/repos/ft_transcendence/backend/img/default.jpg';

-- CreateTable
CREATE TABLE "Message" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "content" TEXT NOT NULL,
    "senderID" UUID NOT NULL,
    "receiverID" UUID,
    "channelID" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "img" TEXT NOT NULL DEFAULT '/home/jfrancai/repos/ft_transcendence/backend/img/default.jpg',
    "chanName" TEXT NOT NULL,
    "type" "ChannelType" NOT NULL DEFAULT 'PRIVATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password" TEXT,
    "creatorID" UUID NOT NULL,
    "admins" UUID[],
    "bans" UUID[],
    "mute" UUID[],

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
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderID_fkey" FOREIGN KEY ("senderID") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverID_fkey" FOREIGN KEY ("receiverID") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_channelID_fkey" FOREIGN KEY ("channelID") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToUsers" ADD CONSTRAINT "_ChannelToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToUsers" ADD CONSTRAINT "_ChannelToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
