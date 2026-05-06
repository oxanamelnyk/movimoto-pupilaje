CREATE TABLE `clients` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `locations` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `locations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` varchar(255) NOT NULL,
	`client_id` varchar(255) NOT NULL,
	`brand` varchar(255) NOT NULL,
	`model` varchar(255) NOT NULL,
	`vin_or_plate` varchar(255) NOT NULL,
	`color` varchar(255),
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `vehicles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vehicle_storage_records` (
	`id` varchar(255) NOT NULL,
	`vehicle_id` varchar(255) NOT NULL,
	`status` varchar(255) NOT NULL,
	`entry_date` date NOT NULL,
	`exit_date` date,
	`location_id` varchar(255) NOT NULL,
	`destination` varchar(255),
	`request_date` date,
	`requested_by` varchar(255),
	`unpacking_date` date,
	`unpacking_type` varchar(255),
	`notes` text,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vehicle_storage_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `vehicles` ADD CONSTRAINT `vehicles_client_id_clients_id_fk` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vehicle_storage_records` ADD CONSTRAINT `vehicle_storage_records_vehicle_id_vehicles_id_fk` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vehicle_storage_records` ADD CONSTRAINT `vehicle_storage_records_location_id_locations_id_fk` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE no action ON UPDATE no action;