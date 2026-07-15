ALTER TABLE `vehicles` MODIFY COLUMN `notes` text;--> statement-breakpoint
ALTER TABLE `vehicles` ADD `identifier` varchar(50);--> statement-breakpoint
ALTER TABLE `vehicles` ADD `updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP;