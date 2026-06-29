-- Check vehicles table structure
SHOW CREATE TABLE vehicles;

-- Check if referenced IDs exist
SELECT 'Clients:', COUNT(*) FROM clients;
SELECT 'Brands:', COUNT(*) FROM brands;
SELECT 'Models:', COUNT(*) FROM models;
SELECT 'Colors:', COUNT(*) FROM colors;
SELECT 'Vehicle Statuses:', COUNT(*) FROM vehicle_statuses;

-- Show the IDs that exist
SELECT 'All Brands:', id, name FROM brands;
SELECT 'All Models:', id, brand_id, name FROM models;
SELECT 'All Colors:', id, name FROM colors;
SELECT 'All Statuses:', id, name FROM vehicle_statuses;
SELECT 'All Clients:', id, name FROM clients;
