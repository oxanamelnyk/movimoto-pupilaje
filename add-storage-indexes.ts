import "dotenv/config";
import { poolConnection } from "./db/drizzle";

async function addStorageIndexes() {
  const connection = await poolConnection.getConnection();

  try {
    console.log("🔄 Adding indexes for storage and preparation JOINs...");

    // Index for vehicle_storage JOIN on vehicle_id
    await connection.execute(
      "CREATE INDEX idx_vehicle_storage_vehicle_id ON vehicle_storage (vehicle_id)",
    );
    console.log("✅ Created idx_vehicle_storage_vehicle_id");

    // Index for vehicle_preparation JOIN on vehicle_id
    await connection.execute(
      "CREATE INDEX idx_vehicle_preparation_vehicle_id ON vehicle_preparation (vehicle_id)",
    );
    console.log("✅ Created idx_vehicle_preparation_vehicle_id");

    // Index for storage_locations JOIN
    await connection.execute(
      "CREATE INDEX idx_storage_locations_id ON storage_locations (id)",
    );
    console.log("✅ Created idx_storage_locations_id");

    // Index for preparation_types JOIN
    await connection.execute(
      "CREATE INDEX idx_preparation_types_id ON preparation_types (id)",
    );
    console.log("✅ Created idx_preparation_types_id");

    console.log("\n✅ All indexes created successfully!");
  } catch (error: any) {
    if (error.code === "ER_DUP_KEYNAME") {
      console.log("⚠️  Indexes already exist, skipping...");
    } else {
      console.error("❌ Error creating indexes:", error.message);
      throw error;
    }
  } finally {
    connection.release();
    await poolConnection.end();
  }
}

addStorageIndexes();
