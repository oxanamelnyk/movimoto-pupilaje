CREATE TABLE `tipos_estado_vehiculo` (
	`id_tipo_estado_vehiculo` int AUTO_INCREMENT NOT NULL,
	`nombre_estado_vehiculo` varchar(50) NOT NULL,
	CONSTRAINT `tipos_estado_vehiculo_id_tipo_estado_vehiculo` PRIMARY KEY(`id_tipo_estado_vehiculo`)
);
--> statement-breakpoint
INSERT INTO `tipos_estado_vehiculo` (`nombre_estado_vehiculo`) VALUES
('Entrega'),
('Preparación'),
('Salida');
