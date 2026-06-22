-- Reference tables for dropdowns:
-- clients, brands, models, colors, vehicle_statuses,
-- storage_locations, preparation_types

CREATE TABLE clients (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
phone VARCHAR(50),
email VARCHAR(255),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE colors (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE vehicle_statuses (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

INSERT INTO vehicle_statuses (name)
VALUES ('Entrega'), ('Almacenado'), ('Preparado'), ('Entregado');

CREATE TABLE brands (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE models (
id INT AUTO_INCREMENT PRIMARY KEY,
brand_id INT NOT NULL,
name VARCHAR(100) NOT NULL,

FOREIGN KEY (brand_id) REFERENCES brands(id)
) ENGINE=InnoDB;

CREATE TABLE vehicles (
id INT AUTO_INCREMENT PRIMARY KEY,

client_id INT,
brand_id INT,
model_id INT,
color_id INT,
status_id INT,

vin VARCHAR(50),
plate_number VARCHAR(50),

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

FOREIGN KEY (client_id) REFERENCES clients(id),
FOREIGN KEY (brand_id) REFERENCES brands(id),
FOREIGN KEY (model_id) REFERENCES models(id),
FOREIGN KEY (color_id) REFERENCES colors(id),
FOREIGN KEY (status_id) REFERENCES vehicle_statuses(id)
) ENGINE=InnoDB;

CREATE TABLE storage_locations (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

INSERT INTO storage_locations (name)
VALUES ('Sant Climent'), ('Sant Andreu');

CREATE TABLE vehicle_storage (
id INT AUTO_INCREMENT PRIMARY KEY,

vehicle_id INT NOT NULL,
location_id INT,

entry_date DATE NOT NULL,
exit_date DATE NULL,

-- Individual delivery place for this client/vehicle
delivery_place VARCHAR(255),

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
FOREIGN KEY (location_id) REFERENCES storage_locations(id)
) ENGINE=InnoDB;

CREATE TABLE preparation_types (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100) NOT NULL UNIQUE
);
INSERT INTO preparation_types (name)
VALUES
('CON PREENTREGA'),
('SIN MONTAJE'),
('CON MONTAJE');
CREATE TABLE vehicle_preparation (
id INT AUTO_INCREMENT PRIMARY KEY,

vehicle_id INT NOT NULL,
request_date DATE,
requested_by VARCHAR(150),
preparation_date DATE,
preparation_type_id INT,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
FOREIGN KEY (preparation_type_id) REFERENCES preparation_types(id)
) ENGINE=InnoDB;
ALTER TABLE vehicles
ADD notes TEXT;
