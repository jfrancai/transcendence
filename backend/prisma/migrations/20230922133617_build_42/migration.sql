/*
  Warnings:

  - You are about to drop the column `members` on the `Channel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "members";

-- CreateTable
CREATE TABLE "ChannelOnUsers" (
    "userId" UUID NOT NULL,
    "channelId" UUID NOT NULL,

    CONSTRAINT "ChannelOnUsers_pkey" PRIMARY KEY ("userId","channelId")
);

-- AddForeignKey
ALTER TABLE "ChannelOnUsers" ADD CONSTRAINT "ChannelOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelOnUsers" ADD CONSTRAINT "ChannelOnUsers_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
