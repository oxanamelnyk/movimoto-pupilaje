-- Add missing columns to vehicles table
ALTER TABLE vehicles 
ADD COLUMN vin VARCHAR(50) NULL AFTER status_id,
ADD COLUMN plate_number VARCHAR(50) NULL AFTER vin;
