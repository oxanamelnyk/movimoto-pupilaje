import { poolConnection } from "./drizzle";
import type { ExecuteValues } from "mysql2";

export async function withTransaction<T>(
  callback: (operations: {
    execute: (sql: string, values?: ExecuteValues) => Promise<unknown>;
    query: (sql: string, values?: ExecuteValues) => Promise<unknown>;
  }) => Promise<T>,
): Promise<T> {
  const connection = await poolConnection.getConnection();

  try {
    await connection.beginTransaction();

    const operations = {
      execute: async (sql: string, values?: ExecuteValues) => {
        const [result] = await connection.execute(sql, values);
        return result;
      },
      query: async (sql: string, values?: ExecuteValues) => {
        const [result] = await connection.execute(sql, values);
        return result;
      },
    };

    const result = await callback(operations);

    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
