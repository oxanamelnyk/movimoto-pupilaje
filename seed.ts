import "dotenv/config";
import mysql from "mysql2/promise";

async function seed() {
  // Parse DATABASE_URL: mysql://user:password@host:port/database
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  const url = new URL(dbUrl);
  const connection = await mysql.createConnection({
    host: url.hostname,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
  });

  try {
    console.log("🌱 Starting database seed...\n");

    // Seed clients
    console.log("📝 Seeding clients...");
    const clients = [
      ["Juan García", "600123456", "juan@example.com"],
      ["María López", "600234567", "maria@example.com"],
      ["Carlos Smith", "600345678", "carlos@example.com"],
      ["Ana Martínez", "600456789", "ana@example.com"],
    ];
    
    for (const client of clients) {
      await connection.execute(
        "INSERT IGNORE INTO clients (name, phone, email) VALUES (?, ?, ?)",
        client
      );
    }
    console.log(`✅ Added ${clients.length} clients\n`);

    // Seed brands
    console.log("🏭 Seeding brands...");
    const brands = [
      ["Honda"],
      ["Yamaha"],
      ["Suzuki"],
      ["Kawasaki"],
      ["KTM"],
      ["BMW"],
      ["Ducati"],
    ];
    
    for (const brand of brands) {
      await connection.execute(
        "INSERT IGNORE INTO brands (name) VALUES (?)",
        brand
      );
    }
    console.log(`✅ Added ${brands.length} brands\n`);

    // Seed models
    console.log("🚍 Seeding models...");
    const models = [
      [1, "CB500F"],
      [1, "CB650R"],
      [2, "MT-07"],
      [2, "MT-09"],
      [3, "GSX-R750"],
      [4, "Ninja 400"],
      [5, "Duke 390"],
      [6, "G 310 GS"],
      [7, "Monster"],
    ];
    
    for (const model of models) {
      await connection.execute(
        "INSERT IGNORE INTO models (brand_id, name) VALUES (?, ?)",
        model
      );
    }
    console.log(`✅ Added ${models.length} models\n`);

    // Seed colors
    console.log("🎨 Seeding colors...");
    const colors = [
      ["Black"],
      ["White"],
      ["Red"],
      ["Blue"],
      ["Silver"],
      ["Yellow"],
      ["Green"],
      ["Orange"],
      ["Grey"],
    ];
    
    for (const color of colors) {
      await connection.execute(
        "INSERT IGNORE INTO colors (name) VALUES (?)",
        color
      );
    }
    console.log(`✅ Added ${colors.length} colors\n`);

    // Seed vehicle statuses
    console.log("📊 Seeding vehicle statuses...");
    const statuses = [
      ["Entrega"],
      ["Almacenado"],
      ["Preparado"],
      ["Entregado"],
    ];
    
    for (const status of statuses) {
      await connection.execute(
        "INSERT IGNORE INTO vehicle_statuses (name) VALUES (?)",
        status
      );
    }
    console.log(`✅ Added ${statuses.length} vehicle statuses\n`);

    // Seed storage locations
    console.log("📍 Seeding storage locations...");
    const locations = [
      ["Sant Climent"],
      ["Sant Andreu"],
      ["Warehouse 3"],
    ];
    
    for (const location of locations) {
      await connection.execute(
        "INSERT IGNORE INTO storage_locations (name) VALUES (?)",
        location
      );
    }
    console.log(`✅ Added ${locations.length} storage locations\n`);

    // Seed preparation types
    console.log("🔧 Seeding preparation types...");
    const prepTypes = [
      ["CON PREENTREGA"],
      ["SIN MONTAJE"],
      ["CON MONTAJE"],
    ];
    
    for (const type of prepTypes) {
      await connection.execute(
        "INSERT IGNORE INTO preparation_types (name) VALUES (?)",
        type
      );
    }
    console.log(`✅ Added ${prepTypes.length} preparation types\n`);

    console.log("✨ Done! Database has been seeded with sample data.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seed();
