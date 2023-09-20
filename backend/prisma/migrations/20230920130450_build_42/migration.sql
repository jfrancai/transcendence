/*
  Warnings:

  - A unique constraint covering the columns `[displayName]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Channel_displayName_key" ON "Channel"("displayName");
