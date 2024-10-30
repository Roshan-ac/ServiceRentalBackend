/*
  Warnings:

  - A unique constraint covering the columns `[customerId]` on the table `Avatar` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Avatar" ADD COLUMN     "customerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Avatar_customerId_key" ON "Avatar"("customerId");

-- AddForeignKey
ALTER TABLE "Avatar" ADD CONSTRAINT "Avatar_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
