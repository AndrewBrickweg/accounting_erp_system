/*
  Warnings:

  - Added the required column `type` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "isPosted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "postedAt" TIMESTAMP(3),
ADD COLUMN     "referenceNumber" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'draft',
ADD COLUMN     "type" TEXT NOT NULL;
