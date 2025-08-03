/*
  Warnings:

  - You are about to drop the `ChartOfAccounts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GLCoding" DROP CONSTRAINT "GLCoding_accountId_fkey";

-- DropForeignKey
ALTER TABLE "JournalLine" DROP CONSTRAINT "JournalLine_accountId_fkey";

-- DropTable
DROP TABLE "ChartOfAccounts";

-- CreateTable
CREATE TABLE "ChartOfAccount" (
    "id" SERIAL NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ChartOfAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChartOfAccount_accountNumber_key" ON "ChartOfAccount"("accountNumber");

-- AddForeignKey
ALTER TABLE "GLCoding" ADD CONSTRAINT "GLCoding_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ChartOfAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalLine" ADD CONSTRAINT "JournalLine_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ChartOfAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
