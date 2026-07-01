-- Create pricing_tiers table
CREATE TABLE IF NOT EXISTS pricing_tiers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  daily_rate DECIMAL(10, 2) NOT NULL COMMENT 'EUR per day',
  handling_in_out DECIMAL(10, 2) NOT NULL COMMENT 'EUR for handling',
  disassembly_without_wheels DECIMAL(10, 2) NOT NULL COMMENT 'EUR for disassembly',
  disassembly_with_wheels DECIMAL(10, 2) NOT NULL COMMENT 'EUR for disassembly with wheels',
  waste_disposal DECIMAL(10, 2) NOT NULL COMMENT 'EUR for waste disposal',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id VARCHAR(255) PRIMARY KEY,
  client_id INT NOT NULL,
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  invoice_date VARCHAR(10) NOT NULL,
  period_type VARCHAR(20) NOT NULL COMMENT 'period or monthly',
  period_start VARCHAR(10) NOT NULL,
  period_end VARCHAR(10) NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  tax_percentage DECIMAL(5, 2) DEFAULT 21,
  tax_amount DECIMAL(12, 2) NOT NULL,
  total DECIMAL(12, 2) NOT NULL,
  notes VARCHAR(500),
  status VARCHAR(20) DEFAULT 'draft' COMMENT 'draft, issued, paid, cancelled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_client (client_id),
  KEY idx_invoice_number (invoice_number),
  KEY idx_status (status)
);

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS invoice_items (
  id VARCHAR(255) PRIMARY KEY,
  invoice_id VARCHAR(255) NOT NULL,
  vehicle_id INT NOT NULL,
  registration_identity VARCHAR(50),
  description VARCHAR(255) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY idx_invoice (invoice_id),
  KEY idx_vehicle (vehicle_id),
  CONSTRAINT fk_invoice_items_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

-- Insert default pricing tier
INSERT INTO pricing_tiers (name, daily_rate, handling_in_out, disassembly_without_wheels, disassembly_with_wheels, waste_disposal) 
VALUES ('Estándar', 0.34, 3.00, 17.00, 24.00, 2.50)
ON DUPLICATE KEY UPDATE id=id;
