/*
  Warnings:

  - You are about to drop the column `channelId` on the `ChanInvite` table. All the data in the column will be lost.
  - You are about to drop the column `usersId` on the `ChanInvite` table. All the data in the column will be lost.
  - You are about to drop the column `channelId` on the `ChanRestrict` table. All the data in the column will be lost.
  - You are about to drop the column `usersId` on the `ChanRestrict` table. All the data in the column will be lost.
  - You are about to drop the column `creatorId` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `channelId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `receiverId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `Message` table. All the data in the column will be lost.
  - Added the required column `channelID` to the `ChanInvite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usersID` to the `ChanInvite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channelID` to the `ChanRestrict` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usersID` to the `ChanRestrict` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorID` to the `Channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverID` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderID` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChanInvite" DROP CONSTRAINT "ChanInvite_channelId_fkey";

-- DropForeignKey
ALTER TABLE "ChanInvite" DROP CONSTRAINT "ChanInvite_usersId_fkey";

-- DropForeignKey
ALTER TABLE "ChanRestrict" DROP CONSTRAINT "ChanRestrict_channelId_fkey";

-- DropForeignKey
ALTER TABLE "ChanRestrict" DROP CONSTRAINT "ChanRestrict_usersId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_channelId_fkey";

-- AlterTable
ALTER TABLE "ChanInvite" DROP COLUMN "channelId",
DROP COLUMN "usersId",
ADD COLUMN     "channelID" UUID NOT NULL,
ADD COLUMN     "usersID" UUID NOT NULL;

-- AlterTable
ALTER TABLE "ChanRestrict" DROP COLUMN "channelId",
DROP COLUMN "usersId",
ADD COLUMN     "channelID" UUID NOT NULL,
ADD COLUMN     "usersID" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "creatorId",
ADD COLUMN     "creatorID" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "channelId",
DROP COLUMN "receiverId",
DROP COLUMN "senderId",
ADD COLUMN     "channelID" UUID,
ADD COLUMN     "receiverID" UUID NOT NULL,
ADD COLUMN     "senderID" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_channelID_fkey" FOREIGN KEY ("channelID") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChanInvite" ADD CONSTRAINT "ChanInvite_usersID_fkey" FOREIGN KEY ("usersID") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChanInvite" ADD CONSTRAINT "ChanInvite_channelID_fkey" FOREIGN KEY ("channelID") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChanRestrict" ADD CONSTRAINT "ChanRestrict_usersID_fkey" FOREIGN KEY ("usersID") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChanRestrict" ADD CONSTRAINT "ChanRestrict_channelID_fkey" FOREIGN KEY ("channelID") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
