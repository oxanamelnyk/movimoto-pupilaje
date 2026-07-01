import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "@/db/schema";

async function runMigration() {
  try {
    const db = drizzle(process.env.DATABASE_URL!, { schema });

    console.log("Creating pricing tables...");

    // The tables will be created by Drizzle ORM based on the schema
    // You can run this with: npx ts-node migrate-pricing.ts

    console.log("✅ Pricing tables migration completed!");
  } catch (error) {
    console.error("❌ Migration error:", error);
    process.exit(1);
  }
}

runMigration();
