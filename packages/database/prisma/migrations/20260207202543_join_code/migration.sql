/*
  Warnings:

  - You are about to drop the column `joinCode` on the `Quiz` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[joinCode]` on the table `GameSession` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `joinCode` to the `GameSession` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Quiz_joinCode_key";

-- AlterTable
ALTER TABLE "GameSession" ADD COLUMN     "joinCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "joinCode";

-- CreateIndex
CREATE UNIQUE INDEX "GameSession_joinCode_key" ON "GameSession"("joinCode");
