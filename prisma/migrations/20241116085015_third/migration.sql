/*
  Warnings:

  - You are about to drop the column `estimatedBudget` on the `Post` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Post_customerId_key";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "estimatedBudget",
ADD COLUMN     "dailyRate" INTEGER,
ADD COLUMN     "fixedRate" INTEGER;
