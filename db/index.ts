// Re-export Drizzle instance
export { db } from "./drizzle";

import type { ExecuteValues, RowDataPacket } from "mysql2";

import { poolConnection } from "./drizzle";

export async function query<T extends RowDataPacket[] = RowDataPacket[]>(
  sql: string,
  values?: ExecuteValues,
): Promise<T> {
  const connection = await poolConnection.getConnection();

  try {
    const [results] = await connection.execute<T>(sql, values);
    return results as T;
  } finally {
    connection.release();
  }
}

export async function execute(sql: string, values?: ExecuteValues) {
  const connection = await poolConnection.getConnection();

  try {
    return await connection.execute(sql, values);
  } finally {
    connection.release();
  }
}
