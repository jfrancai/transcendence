/*
  Warnings:

  - You are about to drop the `ChannelOnUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChannelOnUsers" DROP CONSTRAINT "ChannelOnUsers_channelId_fkey";

-- DropForeignKey
ALTER TABLE "ChannelOnUsers" DROP CONSTRAINT "ChannelOnUsers_userId_fkey";

-- DropTable
DROP TABLE "ChannelOnUsers";

-- CreateTable
CREATE TABLE "_ChannelToUsers" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelToUsers_AB_unique" ON "_ChannelToUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelToUsers_B_index" ON "_ChannelToUsers"("B");

-- AddForeignKey
ALTER TABLE "_ChannelToUsers" ADD CONSTRAINT "_ChannelToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToUsers" ADD CONSTRAINT "_ChannelToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
