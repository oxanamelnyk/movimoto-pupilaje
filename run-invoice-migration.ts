import "dotenv/config";
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log("📡 Connecting to database...");

    const sqlFile = fs.readFileSync(
      path.join(process.cwd(), "drizzle/0008_create_invoices.sql"),
      "utf8",
    );

    // Split by semicolon and execute each statement
    const statements = sqlFile
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      console.log(`\n✨ Executing: ${statement.substring(0, 50)}...`);
      await connection.execute(statement);
    }

    console.log("\n✅ Invoice tables created successfully!");
    console.log("   - pricing_tiers");
    console.log("   - invoices");
    console.log("   - invoice_items");
  } catch (error) {
    console.error("❌ Migration error:", error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runMigration();
