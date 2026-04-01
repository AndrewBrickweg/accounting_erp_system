DO $$
BEGIN
  CREATE TYPE "InvoiceStatus" AS ENUM ('draft', 'sent', 'paid', 'overdue');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "GLCodingType" AS ENUM ('debit', 'credit');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "TransactionType" AS ENUM ('journal', 'payment', 'receipt', 'transfer');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "TransactionStatus" AS ENUM ('draft', 'posted', 'void');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "PaymentMethod" AS ENUM ('credit_card', 'ach', 'wire', 'check');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "ChartOfAccountType" AS ENUM ('asset', 'liability', 'equity', 'revenue', 'expense');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "SalesInvoiceStatus" AS ENUM ('pending', 'paid', 'overdue');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

UPDATE "Transaction"
SET "status" = 'posted'
WHERE "isPosted" = true
  AND LOWER("status") <> 'posted';

UPDATE "Transaction"
SET "postedAt" = NULL
WHERE LOWER("status") <> 'posted';

UPDATE "Transaction"
SET "postedAt" = COALESCE("postedAt", NOW())
WHERE LOWER("status") = 'posted';

ALTER TABLE "Invoice"
ALTER COLUMN "totalAmount" TYPE DECIMAL(18, 2)
USING ROUND("totalAmount"::numeric, 2),
ALTER COLUMN "status" TYPE "InvoiceStatus"
USING LOWER("status")::"InvoiceStatus";

ALTER TABLE "GLCoding"
ALTER COLUMN "amount" TYPE DECIMAL(18, 2)
USING ROUND("amount"::numeric, 2),
ALTER COLUMN "type" TYPE "GLCodingType"
USING (
  CASE
    WHEN "type" IS NULL THEN NULL
    WHEN LOWER("type") IN ('dr', 'debit') THEN 'debit'
    WHEN LOWER("type") IN ('cr', 'credit') THEN 'credit'
    ELSE LOWER("type")
  END
)::"GLCodingType";

ALTER TABLE "Payment"
ALTER COLUMN "amountPaid" TYPE DECIMAL(18, 2)
USING ROUND("amountPaid"::numeric, 2),
ALTER COLUMN "method" TYPE "PaymentMethod"
USING LOWER("method")::"PaymentMethod";

ALTER TABLE "ChartOfAccount"
ALTER COLUMN "type" TYPE "ChartOfAccountType"
USING LOWER("type")::"ChartOfAccountType";

ALTER TABLE "SalesInvoice"
ALTER COLUMN "totalAmount" TYPE DECIMAL(18, 2)
USING ROUND("totalAmount"::numeric, 2),
ALTER COLUMN "taxAmount" TYPE DECIMAL(18, 2)
USING CASE
  WHEN "taxAmount" IS NULL THEN NULL
  ELSE ROUND("taxAmount"::numeric, 2)
END,
ALTER COLUMN "status" TYPE "SalesInvoiceStatus"
USING LOWER("status")::"SalesInvoiceStatus";

ALTER TABLE "Transaction"
ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "Transaction"
ALTER COLUMN "type" TYPE "TransactionType"
USING LOWER("type")::"TransactionType",
ALTER COLUMN "status" TYPE "TransactionStatus"
USING LOWER("status")::"TransactionStatus";

ALTER TABLE "Transaction"
ALTER COLUMN "status" SET DEFAULT 'draft';

ALTER TABLE "Transaction"
DROP COLUMN "isPosted";

ALTER TABLE "GLCoding" DROP CONSTRAINT IF EXISTS "GLCoding_invoiceId_fkey";
ALTER TABLE "GLCoding" DROP CONSTRAINT IF EXISTS "GLCoding_departmentId_fkey";
ALTER TABLE "GLCoding" DROP CONSTRAINT IF EXISTS "GLCoding_transactionId_fkey";

ALTER TABLE "GLCoding"
ADD CONSTRAINT "GLCoding_invoiceId_fkey"
FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "GLCoding"
ADD CONSTRAINT "GLCoding_departmentId_fkey"
FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "GLCoding"
ADD CONSTRAINT "GLCoding_transactionId_fkey"
FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "Employee_departmentId_idx" ON "Employee"("departmentId");
CREATE INDEX IF NOT EXISTS "Employee_managerId_idx" ON "Employee"("managerId");
CREATE INDEX IF NOT EXISTS "Invoice_vendorId_idx" ON "Invoice"("vendorId");
CREATE INDEX IF NOT EXISTS "Invoice_submittedById_idx" ON "Invoice"("submittedById");
CREATE INDEX IF NOT EXISTS "Invoice_departmentId_idx" ON "Invoice"("departmentId");
CREATE INDEX IF NOT EXISTS "Invoice_status_dueDate_idx" ON "Invoice"("status", "dueDate");
CREATE INDEX IF NOT EXISTS "GLCoding_accountId_idx" ON "GLCoding"("accountId");
CREATE INDEX IF NOT EXISTS "GLCoding_invoiceId_idx" ON "GLCoding"("invoiceId");
CREATE INDEX IF NOT EXISTS "GLCoding_departmentId_idx" ON "GLCoding"("departmentId");
CREATE INDEX IF NOT EXISTS "GLCoding_transactionId_idx" ON "GLCoding"("transactionId");
CREATE INDEX IF NOT EXISTS "Transaction_status_date_idx" ON "Transaction"("status", "date");
CREATE INDEX IF NOT EXISTS "Payment_paidById_idx" ON "Payment"("paidById");
CREATE INDEX IF NOT EXISTS "Payment_invoiceId_paymentDate_idx" ON "Payment"("invoiceId", "paymentDate");
CREATE INDEX IF NOT EXISTS "SalesInvoice_customerId_idx" ON "SalesInvoice"("customerId");
CREATE INDEX IF NOT EXISTS "SalesInvoice_submittedById_idx" ON "SalesInvoice"("submittedById");
CREATE INDEX IF NOT EXISTS "SalesInvoice_status_dueDate_idx" ON "SalesInvoice"("status", "dueDate");

ALTER TABLE "Invoice" DROP CONSTRAINT IF EXISTS "Invoice_totalAmount_positive";
ALTER TABLE "Invoice" DROP CONSTRAINT IF EXISTS "Invoice_due_date_after_invoice_date";
ALTER TABLE "GLCoding" DROP CONSTRAINT IF EXISTS "GLCoding_amount_non_negative";
ALTER TABLE "Payment" DROP CONSTRAINT IF EXISTS "Payment_amountPaid_positive";
ALTER TABLE "SalesInvoice" DROP CONSTRAINT IF EXISTS "SalesInvoice_totalAmount_non_negative";
ALTER TABLE "SalesInvoice" DROP CONSTRAINT IF EXISTS "SalesInvoice_taxAmount_non_negative";
ALTER TABLE "SalesInvoice" DROP CONSTRAINT IF EXISTS "SalesInvoice_due_date_after_invoice_date";
ALTER TABLE "Transaction" DROP CONSTRAINT IF EXISTS "Transaction_status_postedAt_consistent";

ALTER TABLE "Invoice"
ADD CONSTRAINT "Invoice_totalAmount_positive"
CHECK ("totalAmount" > 0),
ADD CONSTRAINT "Invoice_due_date_after_invoice_date"
CHECK ("dueDate" >= "invoiceDate");

ALTER TABLE "GLCoding"
ADD CONSTRAINT "GLCoding_amount_non_negative"
CHECK ("amount" >= 0);

ALTER TABLE "Payment"
ADD CONSTRAINT "Payment_amountPaid_positive"
CHECK ("amountPaid" > 0);

ALTER TABLE "SalesInvoice"
ADD CONSTRAINT "SalesInvoice_totalAmount_non_negative"
CHECK ("totalAmount" >= 0),
ADD CONSTRAINT "SalesInvoice_taxAmount_non_negative"
CHECK ("taxAmount" IS NULL OR "taxAmount" >= 0),
ADD CONSTRAINT "SalesInvoice_due_date_after_invoice_date"
CHECK ("dueDate" >= "invoiceDate");

ALTER TABLE "Transaction"
ADD CONSTRAINT "Transaction_status_postedAt_consistent"
CHECK (
  ("status" = 'posted' AND "postedAt" IS NOT NULL) OR
  ("status" <> 'posted' AND "postedAt" IS NULL)
);
