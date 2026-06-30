-- Merge vin and plate_number into a single registration_identity field
ALTER TABLE vehicles ADD COLUMN registration_identity VARCHAR(255);

-- Copy data from both columns
UPDATE vehicles 
SET registration_identity = COALESCE(CONCAT_WS(' / ', NULLIF(vin, ''), NULLIF(plate_number, '')), vin, plate_number);

-- Drop old columns
ALTER TABLE vehicles DROP COLUMN vin;
ALTER TABLE vehicles DROP COLUMN plate_number;
