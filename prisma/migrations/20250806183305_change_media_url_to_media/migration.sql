/*
  Warnings:

  - You are about to drop the column `mediaUrl` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "mediaUrl",
ADD COLUMN     "media" TEXT;
