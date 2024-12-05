/*
  Warnings:

  - A unique constraint covering the columns `[customerId]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `timeUnit` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "estimatedTimeUnit" AS ENUM ('HOUR', 'DAY', 'WEEK', 'MONTH');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_customerId_fkey";

-- AlterTable
ALTER TABLE "Freelancer" ADD COLUMN     "dailyRate" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "timeUnit" "estimatedTimeUnit" NOT NULL,
ALTER COLUMN "customerId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "porposal" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "freelancerId" TEXT NOT NULL,

    CONSTRAINT "porposal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "porposal_id_key" ON "porposal"("id");

-- CreateIndex
CREATE UNIQUE INDEX "porposal_postId_key" ON "porposal"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "porposal_freelancerId_key" ON "porposal"("freelancerId");

-- CreateIndex
CREATE UNIQUE INDEX "Post_customerId_key" ON "Post"("customerId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "porposal" ADD CONSTRAINT "porposal_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "Freelancer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "porposal" ADD CONSTRAINT "porposal_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
