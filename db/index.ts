// Re-export Drizzle instance
export { db } from "./drizzle";

// Use the same pool from drizzle.ts
import { poolConnection } from "./drizzle";

export async function query(sql: string, values?: any[]) {
  const connection = await poolConnection.getConnection();
  try {
    const [results] = await connection.execute(sql, values);
    return results;
  } finally {
    connection.release();
  }
}

export async function execute(sql: string, values?: any[]) {
  const connection = await poolConnection.getConnection();
  try {
    const result = await connection.execute(sql, values);
    return result;
  } finally {
    connection.release();
  }
}
