import "dotenv/config";
import mysql from "mysql2/promise";

async function addIndex() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "movimoto_bk2503",
  });

  const connection = await pool.getConnection();

  try {
    console.log("📌 Creating index on vehicles.created_at...\n");

    await connection.execute(
      `CREATE INDEX idx_vehicles_created_at ON vehicles(created_at DESC)`,
    );

    console.log("✅ Index created successfully!\n");

    // Run EXPLAIN again to see the improvement
    console.log("🔍 Running EXPLAIN again with the new index...\n");

    const sql = `
      EXPLAIN SELECT 
        v.id,
        v.identifier,
        v.registration_identity,
        v.brand_id,
        b.name as brand_name,
        v.model_id,
        m.name as model_name,
        v.color_id,
        col.name as color_name,
        v.status_id,
        vs.name as status_name,
        v.client_id,
        v.created_at
      FROM vehicles v
      LEFT JOIN brands b ON v.brand_id = b.id
      LEFT JOIN models m ON v.model_id = m.id
      LEFT JOIN colors col ON v.color_id = col.id
      LEFT JOIN vehicle_statuses vs ON v.status_id = vs.id
      ORDER BY v.created_at DESC
      LIMIT 100 OFFSET 0
    `;

    const [results] = await connection.execute(sql);
    console.table(results);
  } catch (error: unknown) {
    if ((error as Error).message.includes("Duplicate key name")) {
      console.log("⚠️ Index already exists");
    } else {
      console.error("❌ Error:", (error as Error).message);
    }
  } finally {
    connection.release();
    await pool.end();
  }
}

addIndex();
