import { execute } from "@/db";

async function runMigration() {
  try {
    console.log("Starting migration: merging vin and plate_number columns...");

    // Add new column
    console.log("Adding registration_identity column...");
    await execute(
      `ALTER TABLE vehicles ADD COLUMN registration_identity VARCHAR(255)`
    );
    console.log("✓ Column added");

    // Copy data from both columns
    console.log("Copying data from vin and plate_number to registration_identity...");
    await execute(
      `UPDATE vehicles 
       SET registration_identity = COALESCE(CONCAT_WS(' / ', NULLIF(vin, ''), NULLIF(plate_number, '')), vin, plate_number)`
    );
    console.log("✓ Data copied");

    // Drop old columns
    console.log("Dropping old vin column...");
    await execute(`ALTER TABLE vehicles DROP COLUMN vin`);
    console.log("✓ vin column dropped");

    console.log("Dropping old plate_number column...");
    await execute(`ALTER TABLE vehicles DROP COLUMN plate_number`);
    console.log("✓ plate_number column dropped");

    console.log("\n✅ Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
