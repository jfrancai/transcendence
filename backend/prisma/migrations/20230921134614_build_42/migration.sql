-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "banList" UUID[],
ADD COLUMN     "inviteList" UUID[],
ADD COLUMN     "muteList" UUID[];
