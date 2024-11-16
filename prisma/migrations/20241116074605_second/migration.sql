/*
  Warnings:

  - The values [HOURLY] on the enum `PaymentMode` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `estimatedBudget` on the `Post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentMode_new" AS ENUM ('DAILY', 'FIXED');
ALTER TABLE "Post" ALTER COLUMN "paymentMode" TYPE "PaymentMode_new" USING ("paymentMode"::text::"PaymentMode_new");
ALTER TYPE "PaymentMode" RENAME TO "PaymentMode_old";
ALTER TYPE "PaymentMode_new" RENAME TO "PaymentMode";
DROP TYPE "PaymentMode_old";
COMMIT;

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "image" DROP NOT NULL,
DROP COLUMN "estimatedBudget",
ADD COLUMN     "estimatedBudget" INTEGER NOT NULL;
