/*
  Warnings:

  - You are about to drop the column `isDeposit` on the `BankTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `transactionDate` on the `BankTransaction` table. All the data in the column will be lost.
  - Added the required column `date` to the `BankTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ReconciliationStatus" ADD VALUE 'IN_PROGRESS';
ALTER TYPE "ReconciliationStatus" ADD VALUE 'COMPLETED';
ALTER TYPE "ReconciliationStatus" ADD VALUE 'ERROR';

-- AlterTable
ALTER TABLE "BankReconciliation" ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "BankTransaction" DROP COLUMN "isDeposit",
DROP COLUMN "transactionDate",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "reference" TEXT;

-- CreateTable
CREATE TABLE "ReconciledTransaction" (
    "id" SERIAL NOT NULL,
    "reconciliationId" INTEGER NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "isMatched" BOOLEAN NOT NULL DEFAULT false,
    "matchedAt" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "ReconciledTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReconciledTransaction" ADD CONSTRAINT "ReconciledTransaction_reconciliationId_fkey" FOREIGN KEY ("reconciliationId") REFERENCES "BankReconciliation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReconciledTransaction" ADD CONSTRAINT "ReconciledTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "BankTransaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
