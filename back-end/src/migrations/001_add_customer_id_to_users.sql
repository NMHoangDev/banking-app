-- Adds users.customer_id linked to core_schema.customers(customer_id)
-- Safe to run multiple times.

DO $$
DECLARE
  customer_id_type text;
BEGIN
  SELECT format_type(a.atttypid, a.atttypmod)
  INTO customer_id_type
  FROM pg_attribute a
  JOIN pg_class c ON c.oid = a.attrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'core_schema'
    AND c.relname = 'customers'
    AND a.attname = 'customer_id'
    AND a.attnum > 0
    AND NOT a.attisdropped;

  IF customer_id_type IS NULL THEN
    RAISE EXCEPTION 'Cannot detect type for core_schema.customers.customer_id';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'core_schema'
      AND table_name = 'users'
      AND column_name = 'customer_id'
  ) THEN
    EXECUTE format(
      'ALTER TABLE core_schema.users ADD COLUMN customer_id %s UNIQUE',
      customer_id_type
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'users_customer_id_fkey'
  ) THEN
    ALTER TABLE core_schema.users
      ADD CONSTRAINT users_customer_id_fkey
      FOREIGN KEY (customer_id)
      REFERENCES core_schema.customers(customer_id)
      ON DELETE SET NULL;
  END IF;
END $$;

