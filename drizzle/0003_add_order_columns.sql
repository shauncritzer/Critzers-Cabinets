-- Add new columns to orders table for e-commerce checkout
-- Migration will be handled by application code with safe checks

-- Note: This file exists for documentation.
-- The actual migration is handled by the server startup code
-- which safely adds columns only if they don't exist.

-- New columns added:
-- shipping_city varchar(100)
-- shipping_state varchar(50)
-- shipping_zip varchar(20)
-- shipping_method varchar(100)
-- stripe_payment_intent_id varchar(255)
-- stripe_customer_id varchar(255)
-- tracking_number varchar(255)
-- notes text
