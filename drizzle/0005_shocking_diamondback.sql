CREATE TABLE `brands` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `brands_id` PRIMARY KEY(`id`),
	CONSTRAINT `brands_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `colors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	CONSTRAINT `colors_id` PRIMARY KEY(`id`),
	CONSTRAINT `colors_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `tariff_plans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`client_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`valid_from` date NOT NULL,
	`valid_to` date,
	`status` enum('Active','Archived') DEFAULT 'Active',
	`description` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tariff_plans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tariff_services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tariff_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`price` decimal(10,2) DEFAULT '0.00',
	`unit` varchar(50) NOT NULL,
	`type` enum('Fixed','Variable') DEFAULT 'Fixed',
	`discount` decimal(5,2),
	`category` enum('Delivery','Storage') NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tariff_services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `models` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `models_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vehicle_statuses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `vehicle_statuses_id` PRIMARY KEY(`id`),
	CONSTRAINT `vehicle_statuses_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `storage_locations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `storage_locations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `preparation_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `preparation_types_id` PRIMARY KEY(`id`),
	CONSTRAINT `preparation_types_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `vehicle_storage` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vehicle_id` int NOT NULL,
	`location_id` int,
	`entry_date` date NOT NULL,
	`exit_date` date,
	`delivery_place` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `vehicle_storage_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vehicle_preparation` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vehicle_id` int NOT NULL,
	`request_date` date,
	`requested_by` varchar(255),
	`preparation_date` date,
	`preparation_type_id` int,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `vehicle_preparation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoice_items` (
	`id` varchar(255) NOT NULL,
	`invoice_id` varchar(255) NOT NULL,
	`vehicle_id` int NOT NULL,
	`registration_identity` varchar(50),
	`description` varchar(255) NOT NULL,
	`quantity` decimal(10,2) NOT NULL,
	`unit_price` decimal(10,2) NOT NULL,
	`amount` decimal(12,2) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `invoice_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` varchar(255) NOT NULL,
	`client_id` int NOT NULL,
	`invoice_number` varchar(50) NOT NULL,
	`invoice_date` varchar(10) NOT NULL,
	`period_type` varchar(20) NOT NULL,
	`period_start` varchar(10) NOT NULL,
	`period_end` varchar(10) NOT NULL,
	`subtotal` decimal(12,2) NOT NULL,
	`tax_percentage` decimal(5,2) DEFAULT '21',
	`tax_amount` decimal(12,2) NOT NULL,
	`total` decimal(12,2) NOT NULL,
	`notes` varchar(500),
	`status` varchar(20) DEFAULT 'draft',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`),
	CONSTRAINT `invoices_invoice_number_unique` UNIQUE(`invoice_number`)
);
--> statement-breakpoint
CREATE TABLE `pricing_tiers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`daily_rate` decimal(10,2) NOT NULL,
	`handling_in_out` decimal(10,2) NOT NULL,
	`disassembly_without_wheels` decimal(10,2) NOT NULL,
	`disassembly_with_wheels` decimal(10,2) NOT NULL,
	`waste_disposal` decimal(10,2) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pricing_tiers_id` PRIMARY KEY(`id`),
	CONSTRAINT `pricing_tiers_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
ALTER TABLE `vehicles` DROP FOREIGN KEY `vehicles_client_id_clients_id_fk`;
--> statement-breakpoint
ALTER TABLE `clients` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `locations` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `vehicles` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `vehicles` MODIFY COLUMN `client_id` int;--> statement-breakpoint
ALTER TABLE `clients` ADD `phone` varchar(50);--> statement-breakpoint
ALTER TABLE `clients` ADD `email` varchar(255);--> statement-breakpoint
ALTER TABLE `clients` ADD `status` enum('Active','Inactive') DEFAULT 'Active';--> statement-breakpoint
ALTER TABLE `clients` ADD `updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `vehicles` ADD `brand_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `vehicles` ADD `model_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `vehicles` ADD `color_id` int;--> statement-breakpoint
ALTER TABLE `vehicles` ADD `status_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `vehicles` ADD `registration_identity` varchar(255);--> statement-breakpoint
ALTER TABLE `vehicles` ADD `notes` varchar(1000);--> statement-breakpoint
ALTER TABLE `tariff_plans` ADD CONSTRAINT `tariff_plans_client_id_clients_id_fk` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tariff_services` ADD CONSTRAINT `tariff_services_tariff_id_tariff_plans_id_fk` FOREIGN KEY (`tariff_id`) REFERENCES `tariff_plans`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vehicles` DROP COLUMN `brand`;--> statement-breakpoint
ALTER TABLE `vehicles` DROP COLUMN `model`;--> statement-breakpoint
ALTER TABLE `vehicles` DROP COLUMN `vin_or_plate`;--> statement-breakpoint
ALTER TABLE `vehicles` DROP COLUMN `color`;--> statement-breakpoint
ALTER TABLE `vehicles` DROP COLUMN `estado`;