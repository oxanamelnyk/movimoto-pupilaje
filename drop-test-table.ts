import "dotenv/config";
import { createConnection } from "mysql2/promise";

async function dropTestTable() {
  try {
    const connection = await createConnection(process.env.DATABASE_URL!);

    console.log("Dropping test table...");
    await connection.query("DROP TABLE IF EXISTS `test`");
    console.log("✓ Test table dropped successfully!");

    await connection.end();
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

dropTestTable();
