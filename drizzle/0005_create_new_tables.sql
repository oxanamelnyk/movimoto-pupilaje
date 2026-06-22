-- Create brands table
CREATE TABLE IF NOT EXISTS `brands` (
  `id` varchar(255) PRIMARY KEY,
  `name` varchar(255) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create models table
CREATE TABLE IF NOT EXISTS `models` (
  `id` varchar(255) PRIMARY KEY,
  `brand_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create colors table
CREATE TABLE IF NOT EXISTS `colors` (
  `id` varchar(255) PRIMARY KEY,
  `name` varchar(255) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create vehicle_statuses table
CREATE TABLE IF NOT EXISTS `vehicle_statuses` (
  `id` varchar(255) PRIMARY KEY,
  `name` varchar(255) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create storage_locations table
CREATE TABLE IF NOT EXISTS `storage_locations` (
  `id` varchar(255) PRIMARY KEY,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create preparation_types table
CREATE TABLE IF NOT EXISTS `preparation_types` (
  `id` varchar(255) PRIMARY KEY,
  `name` varchar(255) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Modify vehicles table to use IDs
ALTER TABLE `vehicles` DROP FOREIGN KEY `vehicles_client_id_clientes_id_fk`;
DROP INDEX `vehicles_client_id_clientes_id_fk` ON `vehicles`;

ALTER TABLE `vehicles`
  DROP COLUMN `brand`,
  DROP COLUMN `model`,
  DROP COLUMN `vin_or_plate`,
  DROP COLUMN `color`,
  DROP COLUMN `estado`,
  ADD COLUMN `brand_id` varchar(255) NOT NULL AFTER `client_id`,
  ADD COLUMN `model_id` varchar(255) NOT NULL AFTER `brand_id`,
  ADD COLUMN `color_id` varchar(255) AFTER `model_id`,
  ADD COLUMN `status_id` varchar(255) NOT NULL AFTER `color_id`,
  ADD COLUMN `vin` varchar(255) AFTER `status_id`,
  ADD COLUMN `plate_number` varchar(255) AFTER `vin`,
  ADD COLUMN `notes` varchar(1000) AFTER `plate_number`,
  ADD FOREIGN KEY (`client_id`) REFERENCES `clientes`(`id_cliente`),
  ADD FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`),
  ADD FOREIGN KEY (`model_id`) REFERENCES `models`(`id`),
  ADD FOREIGN KEY (`color_id`) REFERENCES `colors`(`id`),
  ADD FOREIGN KEY (`status_id`) REFERENCES `vehicle_statuses`(`id`);

-- Create vehicle_storage table
CREATE TABLE IF NOT EXISTS `vehicle_storage` (
  `id` varchar(255) PRIMARY KEY,
  `vehicle_id` varchar(255) NOT NULL,
  `entry_date` date NOT NULL,
  `exit_date` date,
  `location_id` varchar(255) NOT NULL,
  `delivery_place` varchar(255),
  FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`),
  FOREIGN KEY (`location_id`) REFERENCES `storage_locations`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create vehicle_preparation table
CREATE TABLE IF NOT EXISTS `vehicle_preparation` (
  `id` varchar(255) PRIMARY KEY,
  `vehicle_id` varchar(255) NOT NULL,
  `request_date` date,
  `requested_by` varchar(255),
  `preparation_date` date,
  `preparation_type_id` varchar(255),
  FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`),
  FOREIGN KEY (`preparation_type_id`) REFERENCES `preparation_types`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
