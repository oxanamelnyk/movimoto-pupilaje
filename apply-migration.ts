import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";
import fs from "fs";
import path from "path";

async function main() {
  try {
    const db = drizzle(process.env.DATABASE_URL!);
    console.log("📡 Connecting to database...");

    // Read the migration file
    const migrationPath = path.join("drizzle", "0002_closed_alice.sql");
    const migrationSQL = fs.readFileSync(migrationPath, "utf-8");

    // Split by the breakpoint marker and filter out comments
    const statements = migrationSQL
      .split("--> statement-breakpoint")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt && !stmt.startsWith("--"));

    console.log(`\n🔨 Applying ${statements.length} SQL statements...\n`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (!statement) continue;

      try {
        console.log(`[${i + 1}/${statements.length}] Executing statement...`);
        await db.execute(sql.raw(statement));
        console.log(`✅ Success`);
      } catch (error: unknown) {
        if ((error as Error).message.includes("already exists")) {
          console.log(`⚠️  Already exists (skipping)`);
        } else {
          throw error;
        }
      }
    }

    console.log("\n✅ All migrations applied successfully!");

    // Verify tables were created
    const result = (await db.execute(
      sql`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN ('clients', 'locations', 'vehicles', 'vehicle_storage_records')`,
    )) as unknown as [Array<{ TABLE_NAME: string }>, unknown];

    console.log("\n📊 Created tables:");
    const tableNames = result[0].map((row) => row.TABLE_NAME);
    tableNames.forEach((name: string) => console.log(`   ✓ ${name}`));
  } catch (error) {
    console.error("\n❌ Migration failed:");
    console.error(error);
    process.exit(1);
  }
}

main();
