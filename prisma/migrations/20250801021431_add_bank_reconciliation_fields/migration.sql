/*
  Warnings:

  - Added the required column `openingBalance` to the `BankReconciliation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `BankReconciliation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReconciliationStatus" AS ENUM ('PENDING', 'RECONCILED', 'FLAGGED');

-- DropForeignKey
ALTER TABLE "BankReconciliation" DROP CONSTRAINT "BankReconciliation_completedById_fkey";

-- AlterTable
ALTER TABLE "BankReconciliation" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "difference" DOUBLE PRECISION,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "openingBalance" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "status" "ReconciliationStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "completedById" DROP NOT NULL,
ALTER COLUMN "completedAt" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "BankReconciliation" ADD CONSTRAINT "BankReconciliation_completedById_fkey" FOREIGN KEY ("completedById") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
