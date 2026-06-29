import "dotenv/config";
import mysql from "mysql2/promise";

async function verify() {
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
    console.log("🔍 Verifying database data...\n");

    const [clients] = await connection.execute("SELECT id, name FROM clients");
    console.log("📍 Clients:", clients);

    const [brands] = await connection.execute("SELECT id, name FROM brands");
    console.log("🏷️ Brands:", brands);

    const [models] = await connection.execute("SELECT id, brand_id, name FROM models ORDER BY id");
    console.log("🚗 Models:", models);

    const [colors] = await connection.execute("SELECT id, name FROM colors");
    console.log("🎨 Colors:", colors);

    const [statuses] = await connection.execute("SELECT id, name FROM vehicle_statuses");
    console.log("📊 Statuses:", statuses);

    const [locations] = await connection.execute("SELECT id, name FROM storage_locations");
    console.log("📦 Locations:", locations);

    console.log("\n✅ All data verified");
    process.exit(0);
  } catch (error) {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

verify();
