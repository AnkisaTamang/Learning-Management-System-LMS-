-- Add transaction_uuid column to payments table
ALTER TABLE payments ADD COLUMN transaction_uuid VARCHAR(255) UNIQUE;

-- Update existing records with unique UUIDs
UPDATE payments SET transaction_uuid = CONCAT(id, '-', UNIX_TIMESTAMP(), '-', SUBSTRING(MD5(RAND()), 1, 8)) WHERE transaction_uuid IS NULL;