import "dotenv/config";
import mysql from "mysql2/promise";

async function migrate() {
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
    console.log("🔄 Adding vin and plate_number columns to vehicles...");
    
    await connection.execute(`
      ALTER TABLE vehicles 
      ADD COLUMN vin VARCHAR(50) NULL AFTER status_id,
      ADD COLUMN plate_number VARCHAR(50) NULL AFTER vin
    `);
    
    console.log("✅ Migration complete!");
  } catch (error: any) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log("✅ Columns already exist");
    } else {
      console.error("❌ Migration failed:", error.message);
    }
  } finally {
    await connection.end();
  }
}

migrate();
