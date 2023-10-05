-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_receiverID_fkey";

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "receiverID" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverID_fkey" FOREIGN KEY ("receiverID") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
