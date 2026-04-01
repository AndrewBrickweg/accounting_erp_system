SELECT
  table_name,
  column_name,
  data_type,
  udt_name,
  numeric_precision,
  numeric_scale,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'Invoice',
    'Payment',
    'SalesInvoice',
    'Transaction',
    'GLCoding',
    'ChartOfAccount'
  )
ORDER BY table_name, ordinal_position;

SELECT
  c.relname AS table_name,
  con.conname,
  con.contype,
  pg_get_constraintdef(con.oid) AS definition
FROM pg_constraint con
JOIN pg_class c ON c.oid = con.conrelid
JOIN pg_namespace n ON n.oid = con.connamespace
WHERE n.nspname = 'public'
  AND c.relname IN (
    'Invoice',
    'Payment',
    'SalesInvoice',
    'Transaction',
    'GLCoding',
    'ChartOfAccount'
  )
ORDER BY c.relname, con.contype, con.conname;

SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'Invoice',
    'Payment',
    'SalesInvoice',
    'Transaction',
    'GLCoding',
    'ChartOfAccount'
  )
ORDER BY tablename, indexname;

SELECT
  t.typname AS enum_name,
  e.enumlabel AS enum_value
FROM pg_type t
JOIN pg_enum e ON e.enumtypid = t.oid
JOIN pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'public'
  AND t.typname IN (
    'InvoiceStatus',
    'PaymentMethod',
    'SalesInvoiceStatus',
    'TransactionStatus',
    'TransactionType',
    'GLCodingType',
    'ChartOfAccountType'
  )
ORDER BY t.typname, e.enumsortorder;
