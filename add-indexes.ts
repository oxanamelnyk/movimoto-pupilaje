import "dotenv/config";
import { poolConnection } from "./db/drizzle";

async function addIndexes() {
  const connection = await poolConnection.getConnection();

  try {
    console.log("🔄 Adding indexes to vehicles table...");

    // Index for ORDER BY created_at DESC
    await connection.execute(
      "CREATE INDEX idx_vehicles_created_at ON vehicles (created_at DESC)",
    );
    console.log("✅ Created idx_vehicles_created_at");

    // Indexes for JOIN columns
    await connection.execute(
      "CREATE INDEX idx_vehicles_brand_id ON vehicles (brand_id)",
    );
    console.log("✅ Created idx_vehicles_brand_id");

    await connection.execute(
      "CREATE INDEX idx_vehicles_model_id ON vehicles (model_id)",
    );
    console.log("✅ Created idx_vehicles_model_id");

    await connection.execute(
      "CREATE INDEX idx_vehicles_color_id ON vehicles (color_id)",
    );
    console.log("✅ Created idx_vehicles_color_id");

    await connection.execute(
      "CREATE INDEX idx_vehicles_status_id ON vehicles (status_id)",
    );
    console.log("✅ Created idx_vehicles_status_id");

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

addIndexes();
