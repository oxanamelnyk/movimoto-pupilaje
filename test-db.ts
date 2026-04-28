import { db } from "./db";

async function test() {
  try {
    const result = await db.run({
      sql: "SELECT 1 as connected",
      values: [],
    });
    console.log("✅ Connection successful!");
    console.log(result);
  } catch (error: any) {
    console.error("❌ Connection failed:");
    console.error(error.message);
  }
}

test();
