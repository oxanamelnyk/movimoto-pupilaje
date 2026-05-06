import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";

async function main() {
  try {
    const db = drizzle(process.env.DATABASE_URL!);
    console.log("📡 Testing database connection...");

    // Test connection with a simple query
    const result = await db.execute(sql`SELECT 1 as test`);
    console.log("✅ Database connection successful!");
    console.log("Connection result:", result);

    // Check existing tables
    const tables = await db.execute(
      sql`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE()`,
    );
    console.log("\n📊 Existing tables in database:");
    console.log(tables);
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(error);
    process.exit(1);
  }
}

main();
